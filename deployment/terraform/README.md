# Deploy Smart Home Management System to Kubernetes Cluster with Terraform

This directory contains the Terraform script to deploy the Smart Home Management System to a Kubernetes cluster. Here is
the step to deploy the system:

## Deploy Traefik

Traefik is used to route the traffic to the corresponding microservice. It has to be deployed separately before
deploying other components of the system.

1. Change to the `traefik` directory.

    ```bash
    cd traefik
    ```
2. Configure the `terraform.tfvars` file. The `terraform.tfvars.example` file is provided for your reference.

3. Initialize Terraform.

    ```bash
    terraform init
    ```
4. Deploy Traefik.

    ```bash
    terraform apply
    ```
   or if you'd like to save some time:

    ```bash
    terraform apply -auto-approve
    ```

## Deploy the Smart Home Management System

Now you have Traefik ready, the rest of the deployment should be a smooth ride.

1. Change to the `core` directory.

    ```bash
    cd core
    ```

2. Configure the `terraform.tfvars` file. The `terraform.tfvars.example` file is provided for your reference.

3. Initialize Terraform.

    ```bash
    terraform init
    ```

4. Deploy the Smart Home Management System.

    ```bash
    terraform apply
    ```

   or if you'd like to save some time:

     ```bash
     terraform apply -auto-approve
     ```

Database schemas and credentials will be initiated automatically. So you are all set!

> **Note:** If you want to update the database password, note that you cannot do it directly via terraform since it is
> stored in the database already. Please manually update the password in the database. However, you still have to
> reapply the new password so the microservices can get it.