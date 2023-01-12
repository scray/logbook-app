FROM openjdk:19

#CMD ["mvn clean package"]

COPY target/logbookapp-api-*.jar /logbookapp-api.jar

ENTRYPOINT ["java", "-jar" , "/logbookapp-api.jar"]

#docker build -t logbook_api_test .
#docker run -d -p 8080:8080 logbook_api_test

#TODO --> consult with Herr Obermeyer
#maybe helpful: https://stackoverflow.com/questions/27767264/how-to-dockerize-maven-project-and-how-many-ways-to-accomplish-it