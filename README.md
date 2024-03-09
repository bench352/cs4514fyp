# Smart Home Management System with Real-time Anomaly Detection on Smart Sensor with Machine Learning

**Smart Home Management System** is a cloud-based building management solution for furnished apartment buildings,
allowing the landlord to manage the IoT devices in the system and residents to access IoT devices within the apartment.
Proper authentication and authorization measures are implemented in the system to manage the access of different users.

With real-time anomaly detection on IoT device data using machine learning, the system is able to identify potential
anomaly events in a particular IoT device as data arrives, easing the workload of managing the IoT system.

The system adopts a microservices architecture; all components are containerized, which can be deployed to a Kubernetes
cluster with the help of Helm Chart and Terraform Script.

The project is currently still a work in progress.

## Deployment

Terraform scripts have been created for automatic deployment of all the system components. If you want to try it out,
feel free to check out the [Deployment Instruction](./deployment/terraform/README.md) for details.

