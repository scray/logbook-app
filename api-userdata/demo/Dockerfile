FROM openjdk:19

COPY target/demo-*.jar /logbookapp-api.jar

ENTRYPOINT ["java", "-jar" , "/logbookapp-api.jar"]

#mvn clean package
#docker build -t logbook_api_test .
#docker run -d -p 8080:8080 logbook_api_test


#maybe helpful: https://stackoverflow.com/questions/27767264/how-to-dockerize-maven-project-and-how-many-ways-to-accomplish-it