FROM maven:3.8.3-amazoncorretto-17 AS build

COPY src /home/app/src

COPY pom.xml /home/app

RUN mvn -f /home/app/pom.xml clean package -DskipTests

FROM amazoncorretto:17

COPY --from=build /home/app/target/logbookappApi-*.jar /usr/local/lib/logbookapp-api.jar
RUN mkdir  /wallet
COPY /wallet/ /wallet/

EXPOSE 8080

ENTRYPOINT ["java", "-jar" , "/usr/local/lib/logbookapp-api.jar"]