FROM gradle:7.4.2-jdk17-alpine AS builder

COPY . src/main/java/com/example/demo/

RUN cd  src/main/java/com/example/demo/ && \
    gradle clean && \
    gradle build

FROM gradle:7.4.2-jdk17-alpine

COPY --from=builder src/main/java/com/example/demo/target/onlineShop-0.0.1-SNAPSHOT.jar /usr/local/bin/api.jar

CMD ["java", "-jar", "/usr/local/bin/api.jar"]
