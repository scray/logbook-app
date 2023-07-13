FROM alpine:3.17

RUN apk add --no-cache nodejs npm

RUN mkdir /usr/local/lib/chaincode
RUN mkdir /usr/local/lib/chaincode/logs
RUN mkdir /var/log/chaincode/

COPY ./ /usr/local/lib/chaincode/

WORKDIR /usr/local/lib/chaincode/

CMD ["sh", "-c", "npm install &&  npm start; tail -f /dev/null"]
