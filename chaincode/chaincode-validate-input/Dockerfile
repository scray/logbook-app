 # Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0

ARG GO_VER=1.14.4
ARG ALPINE_VER=3.12

FROM golang:${GO_VER}-alpine${ALPINE_VER}

RUN apk add screen openssh

WORKDIR /go/src/github.com/hyperledger/fabric-samples/asset-transfer-basic/chaincode-external
COPY . .

RUN go get -d -v ./...
RUN go install -v ./...

EXPOSE 9999
# CMD ["chaincode-external"]
CMD ["sh", "-c", "chaincode-external; tail -f /dev/null"]