# Project

# Patates Hastalığı Tespit

## Genel Bakış

Bu proje, patates yapraklarındaki hastalıkları tespit etmek için derin öğrenme kullanan bir tam yığın (full-stack) uygulamadır. Proje şu bileşenlerden oluşmaktadır:

1. **Frontend:** Kullanıcıların patates yapraklarının görüntülerini yüklemesini ve tahmin sonuçlarını görmesini sağlayan React tabanlı bir web uygulaması.
2. **Backend:** Yüklenen görüntüleri işleyen ve bir CNN modeliyle tahmin yapan FastAPI uygulaması.

Model, yaprağın **Early Blight (Erken Yanıklık)**, **Late Blight (Geç Yanıklık)** veya **Sağlıklı** olup olmadığını tahmin eder.

![potato1.PNG](potato1.png)

![potato2.PNG](potato2.png)

![potato3.PNG](potato3.png)

![potato4.PNG](potato4.png)

## Özellikler

- **Frontend:**
    - Görüntü yükleme için kullanıcı dostu bir arayüz.
    - Tahmin sonuçlarını ve güven skorlarını gösterir.
- **Backend:**
    - Yüklenen görüntüleri işler.
    - CNN modelinden tahmin sonuçlarını döner.
- **Derin Öğrenme Modeli:**
    - [PlantVillage veri seti](https://www.kaggle.com/datasets/emmarex/plantdisease) kullanılarak eğitilmiş model.
    - Yüksek doğruluk oranıyla hastalık sınıflandırması yapar.

## Veri Seti

Eğitimde kullanılan veri seti, [PlantVillage veri seti](https://www.kaggle.com/datasets/emmarex/plantdisease) üzerindeki patates yaprağı görüntüleridir. Görseller, `256x256` piksel boyutunda 3 renk kanalıyla işlenmiştir. Her görüntü şu üç sınıftan birine aittir:

1. **Early Blight (Erken Yanıklık)**
2. **Late Blight (Geç Yanıklık)**
3. **Healthy (Sağlıklı)**

## Teknik Detaylar

### Derin Öğrenme Modeli

- **Mimari:** CNN (Convolutional Neural Network)
- **Framework:** TensorFlow/Keras
- **Ön İşleme:**
    - Görseller `256x256` boyutuna yeniden boyutlandırıldı.
    - Piksel değerleri [0, 1] aralığında normalize edildi.
    - Veri artırımı (döndürme, yansıtma) uygulandı.
- **Eğitim:**
    - Veri seti %80 eğitim, %10 doğrulama, %10 test olarak bölündü.
    - Optimizasyon: Adam
    - Kayıp Fonksiyonu: Sparse Categorical Crossentropy
    - Eğitim Süresi: 50 epoch
- **Çıktı:** 3 sınıf için softmax olasılıkları.

Eğitilmiş model, `my_model.h5` dosyası olarak kaydedilmiştir.

### Backend

- **Framework:** FastAPI
- **Endpointler:**
    - `GET /ping`: Sunucunun çalışıp çalışmadığını kontrol eder.
    - `POST /predict`: Görüntü dosyasını alır, işler ve tahmin sınıfını ve güven skorunu döner.
- **CORS:** `http://localhost:3000` adresinden gelen taleplere izin verecek şekilde yapılandırılmıştır.

### Frontend

- **Framework:** React
- **Port:** 3000
- **Ortam Değişkeni:** Backend ile bağlantı kurmak için `REACT_APP_BACKEND_URL=http://localhost:8001` kullanılır.

## Çalıştırma Adımları

### Gereksinimler

- **Docker**

### Kurulum

Bir dizinde “docker-compose.yml” isimli bir dosya oluşturun ve içine aşağıdakileri yapıştırın.

```yaml
services:
  backend:
    image: sibacode/bcnnpotato
    container_name: backend
    ports:
      - "8001:8001"
    networks:
      - app-network

  frontend:
    image: sibacode/fcnnpotato
    container_name: frontend
    ports:
      - "3000:3000"
    networks:
      - app-network
    environment:
      - REACT_APP_BACKEND_URL=http://backend:8001

networks:
  app-network:
    driver: bridge
```

Compose dosyasının bulunduğu dizine konsol aracılığıyla erişin ve şu komutu yazın:

```yaml
docker compose up -d 
```

Bu komut:

- Backend'i [http://localhost:8001](http://localhost:8001/) adresinde başlatır.
- Frontend'i [http://localhost:3000](http://localhost:3000/) adresinde başlatır.

## API Endpointleri

- **GET /ping**
    
    Örnek:
    
    ```bash
    curl http://localhost:8001/ping
    ```
    
    Cevap:
    
    ```bash
    "Hello, I am alive"
    ```
    
- **POST /predict**
    
    Örnek:
    
    ```bash
    curl -X POST -F "file=@yaprak.jpg" http://localhost:8001/predict
    ```
    
    Cevap:
    
    ```json
    json
    Kodu kopyala
    {
      "class": "Early Blight",
      "confidence": 0.99
    }
    ```
    

![Doğruluk ve Kayıp.PNG](Doruluk_ve_Kayp.png)