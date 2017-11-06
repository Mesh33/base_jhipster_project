cd gateway;
gnome-terminal -e "./mvnw"
gnome-terminal -e "yarn start"
cd ../jhipster-registry
gnome-terminal -e "./mvnw"
cd ../microservice1
gnome-terminal -e "./mvnw"
