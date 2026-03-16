# Usa una imagen oficial de OpenJDK con Maven
FROM amazoncorretto:21-alpine-jdk

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia Maven Wrapper correctamente
COPY .mvn/ .mvn/
COPY mvnw mvnw.cmd pom.xml ./

# Da permisos de ejecución al wrapper de Maven
RUN chmod +x mvnw

# Descarga las dependencias para mejorar la cacheabilidad
RUN ./mvnw dependency:resolve dependency:go-offline

# Copia el código fuente
COPY . .

# Compila la aplicación
RUN ./mvnw clean package -DskipTests

# Verifica que el JAR se haya generado
RUN ls -l target/

# Expone el puerto 8080
EXPOSE 8080

# Ejecuta la aplicación
CMD ["java", "-jar", "target/Backend-LiveTogether-0.0.1-SNAPSHOT.jar"]