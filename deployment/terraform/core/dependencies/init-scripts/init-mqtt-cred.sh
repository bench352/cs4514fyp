kubectl config use-context $CONFIG_CONTEXT
kubectl exec -it deploy/mosquitto -n $NAMESPACE -- mosquitto_passwd -c /mosquitto/configinc/mosquitto.passwd $MQTT_USERNAME << EOF
$MQTT_PASSWORD
$MQTT_PASSWORD
EOF
kubectl exec deploy/mosquitto -n $NAMESPACE -- sh -c "echo -n \"password_file /mosquitto/configinc/mosquitto.passwd\" >> /mosquitto/configinc/mosquitto.conf"
kubectl rollout restart deploy/mosquitto -n $NAMESPACE