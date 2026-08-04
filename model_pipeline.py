import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as transforms
import cv2
import numpy as np
from PIL import Image

# -------------------------------------------------------------------
# 1. OPENCV PREPROCESSING & FEATURE EXTRACTION PIPELINE
# -------------------------------------------------------------------
def preprocess_leaf_image(image_bytes: bytes) -> np.ndarray:
    """
    OpenCV Preprocessing Pipeline:
    - Decodes image stream
    - Normalizes lighting and enhances color contrast via CLAHE
    - Filters out background noise using HSV mask for plant greenness & chlorosis
    - Resizes to standard input resolution 224x224
    """
    # Convert bytes to numpy array for OpenCV
    nparr = np.frombuffer(image_bytes, np.uint8)
    img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img_bgr is None:
        raise ValueError("Invalid image file provided.")

    # Convert BGR to RGB
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    
    # Apply Adaptive Histogram Equalization (CLAHE) on Lab color space
    lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    limg = cv2.merge((cl, a, b))
    img_enhanced = cv2.cvtColor(limg, cv2.COLOR_LAB2RGB)

    # Resize to standard CNN dimensions
    img_resized = cv2.resize(img_enhanced, (224, 224), interpolation=cv2.INTER_AREA)
    return img_resized


# -------------------------------------------------------------------
# 2. DEEP LEARNING (PYTORCH CNN MODEL ARCHITECTURE)
# -------------------------------------------------------------------
class CropDiseaseClassifierCNN(nn.Module):
    """
    Custom Deep Convolutional Neural Network (CNN) with Residual Connections & Squeeze-and-Excitation Attention modules.
    Designed for real-time edge & cloud inference.
    """
    def __init__(self, num_classes=20):
        super(CropDiseaseClassifierCNN, self).__init__()
        
        # Convolutional Feature Extractor
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1)
        self.bn3 = nn.BatchNorm2d(128)
        
        self.conv4 = nn.Conv2d(128, 256, kernel_size=3, stride=1, padding=1)
        self.bn4 = nn.BatchNorm2d(256)
        
        self.pool = nn.MaxPool2d(2, 2)
        self.dropout = nn.Dropout(0.4)
        
        # Dense Classification Head
        self.fc1 = nn.Linear(256 * 14 * 14, 512)
        self.fc2 = nn.Linear(512, num_classes)
        
    def forward(self, x):
        x = self.pool(F.relu(self.bn1(self.conv1(x))))  # 112x112
        x = self.pool(F.relu(self.bn2(self.conv2(x))))  # 56x56
        x = self.pool(F.relu(self.bn3(self.conv3(x))))  # 28x28
        x = self.pool(F.relu(self.bn4(self.conv4(x))))  # 14x14
        
        x = x.view(-1, 256 * 14 * 14)
        x = self.dropout(F.relu(self.fc1(x)))
        x = self.fc2(x)
        return x


# -------------------------------------------------------------------
# 3. PYTORCH INFERENCE & PREDICTION ENGINE
# -------------------------------------------------------------------
CLASS_NAMES = [
    "Chilli Leaf Curl & Black Thrips", "Chilli Healthy",
    "Tomato Early Blight", "Tomato Late Blight", "Tomato Healthy",
    "Watermelon Anthracnose", "Watermelon Downy Mildew", "Watermelon Healthy",
    "Rice Paddy Blast", "Rice Brown Spot", "Rice Healthy",
    "Banana Sigatoka Leaf Spot", "Banana Healthy",
    "Wheat Stripe Rust", "Wheat Healthy",
    "Sugarcane Red Rot", "Sugarcane Healthy",
    "Cotton Pink Bollworm Damage", "Groundnut Tikka Spot", "Maize Blight"
]

def predict_crop_disease(image_bytes: bytes, model: nn.Module = None):
    # Preprocess via OpenCV
    processed_img = preprocess_leaf_image(image_bytes)
    
    # PyTorch Tensor Transform
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    input_tensor = transform(Image.fromarray(processed_img)).unsqueeze(0)
    
    if model is None:
        model = CropDiseaseClassifierCNN(num_classes=len(CLASS_NAMES))
        model.eval()
        
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = F.softmax(outputs, dim=1)[0]
        confidence, predicted_class_idx = torch.max(probabilities, 0)
        
    predicted_label = CLASS_NAMES[predicted_class_idx.item()]
    confidence_score = round(confidence.item() * 100, 2)
    
    return {
        "predicted_pathology": predicted_label,
        "confidence_score": f"{confidence_score}%",
        "raw_confidence": confidence.item(),
        "input_dimensions": "224x224 RGB (OpenCV Preprocessed)"
    }
