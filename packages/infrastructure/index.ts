import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { Config } from "@pulumi/pulumi";
import { Provider } from "@pulumi/kubernetes";

import {Deployment} from './src/deployment'
import {Service} from './src/service'

const main = (async () => {

    const config = new Config();
    const org = config.require('org');

    const suffix = config.require('suffix');

    const stackRef = new pulumi.StackReference(`${org}/base-infrastructure/prod`)

    const gatewayRef = new pulumi.StackReference(`${org}/apps/${suffix}`)

    const kubeconfig = stackRef.getOutput('k3sconfig');
    
    const rootServer = gatewayRef.getOutput('internalGatewayUrl');
    const dbUrl = gatewayRef.getOutput('postgres_name');
    const dbPass = gatewayRef.getOutput('postgres_pass');

    const provider = new Provider('eks', { kubeconfig });

    // const deployment = await rootServer.apply(async (url) => await Deployment(provider, url, dbUrl, dbPass));
    // const service = await Service(provider)

    return {
        // service,
        // deployment
    }
})()

// export const deployment = main.then((res) => res.deployment.metadata.name)

// export const service = main.then((res) => res.service.metadata.name)