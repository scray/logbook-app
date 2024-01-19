FROM alpine:3.17

RUN apk add --no-cache nodejs npm

RUN mkdir -p /usr/local/lib/logbook-app/chaincode/logs
RUN mkdir -p /var/log/chaincode/

COPY ./ /usr/local/lib/logbook-app/chaincode

WORKDIR /usr/local/lib/logbook-app/chaincode

CMD ["sh", "-c", "npm install &&  npm start; tail -f /dev/null"]
