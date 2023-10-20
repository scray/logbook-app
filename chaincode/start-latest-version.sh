
function updateChaincode() {
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
}

function parseArgs() {
  while [ "$1" != "" ]; do
        case $1 in
            -b )   shift
                branch_name=$1
        ;;          
        esac
        shift
  done
}

parseArgs "${@}"

if [ -z "$branch_name" ]
then
    echo "Git branch name is empty. Use main as default"
    branch_name=main
fi

updateChaincode