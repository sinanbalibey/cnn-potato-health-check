# Kullanılacak base image belirleniyor
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

# Gerekli kütüphanelerin yüklenmesi
RUN pip install tensorflow fastapi uvicorn python-multipart pillow

# Uygulama dosyalarının kopyalanması
COPY ./app.py /app/app.py
COPY ./my_model.h5 /app/my_model.h5

# Uygulamanın çalıştırılması
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]
