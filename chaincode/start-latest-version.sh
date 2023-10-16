branch_name="$1"

echo  "Kill chaincode"
kill $(ps -ef | pgrep -f fabric-chaincode-node)

echo Load updates from branch $branch_name .

cd /usr/local/lib/logbook-app/chaincode
git pull
git checkout $branch_name
git pull

# Compile project
npm install

# Start chaincode
echo "start chaincode"
nohup npm start > /var/log/chaincode/logbook-app.logs 2>&1 &

tail -f /var/log/chaincode/logbook-app.logs