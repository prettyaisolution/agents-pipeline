import * as cdk from 'aws-cdk-lib/core';
import {Construct} from 'constructs';
import {AgentRuntimeArtifact, Runtime} from 'aws-cdk-lib/aws-bedrockagentcore'
import {DockerImageAsset, Platform} from "aws-cdk-lib/aws-ecr-assets";
import {IgnoreMode, StackProps} from "aws-cdk-lib/core";
import {ManagedPolicy} from "aws-cdk-lib/aws-iam";

interface AgentStackProps extends StackProps{
    agentName: string
}

export class AgentStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: AgentStackProps) {
        super(scope, id, props);

        const container = new DockerImageAsset(this, 'DockerImageAsset', {
            assetName: props.agentName,
            directory: `../${props.agentName}`,
            ignoreMode: IgnoreMode.GLOB,
            platform: Platform.LINUX_ARM64,
        })

        const agentRuntimeArtifact = AgentRuntimeArtifact.fromImageUri(container.imageUri)

        const runtime = new Runtime(this, "Runtime", {
            runtimeName: props.agentName,
            agentRuntimeArtifact: agentRuntimeArtifact,

        });

        container.repository.grantPull(runtime.role)
        runtime.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonBedrockLimitedAccess'))

    }
}
