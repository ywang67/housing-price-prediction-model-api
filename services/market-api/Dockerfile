FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /workspace

COPY services/market-api/pom.xml ./pom.xml
RUN mvn dependency:go-offline

COPY services/market-api/src ./src
RUN mvn clean package -DskipTests


FROM eclipse-temurin:21-jre

WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN groupadd --system app && useradd --system --gid app --create-home --home-dir /app app

COPY --from=build \
    /workspace/target/market-api-0.0.1-SNAPSHOT.jar \
    ./market-api.jar

COPY ["data/House Price Dataset.csv", "/app/data/housing.csv"]

RUN chown -R app:app /app

ENV MARKET_DATASET_PATH=/app/data/housing.csv
ENV ML_API_URL=http://ml-api:8000

EXPOSE 8002

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -fsS http://localhost:8002/actuator/health || exit 1

USER app

ENTRYPOINT ["java", "-jar", "market-api.jar"]
