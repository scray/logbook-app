FROM openjdk:19

COPY target/demo-*.jar /logbookapp-api.jar

ENTRYPOINT ["java", "-jar" , "/logbookapp-api.jar"]

#mvn clean package
#docker build -t logbook_api_test .
#docker run -d -p 8080:8080 logbook_api_test