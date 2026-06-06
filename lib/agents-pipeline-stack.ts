import * as cdk from 'aws-cdk-lib/core';
import {Construct} from 'constructs';
import {AgentRuntimeArtifact, Runtime} from 'aws-cdk-lib/aws-bedrockagentcore'
import {DockerImageAsset, Platform} from "aws-cdk-lib/aws-ecr-assets";
import {IgnoreMode} from "aws-cdk-lib/core";
import {ManagedPolicy} from "aws-cdk-lib/aws-iam";

export class AgentsPipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const container = new DockerImageAsset(this, 'MyAgent2C', {
            assetName: "MyAgent2",
            directory: `../MyAgent2`,
            ignoreMode: IgnoreMode.GLOB,
            platform: Platform.LINUX_ARM64,
        })

        const agentRuntimeArtifact = AgentRuntimeArtifact.fromImageUri(container.imageUri)

        const myAgent2 = new Runtime(this, "MyAgent2R", {
            runtimeName: "MyAgent2",
            agentRuntimeArtifact: agentRuntimeArtifact,

        });

        container.repository.grantPull(myAgent2.role)
        myAgent2.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonBedrockLimitedAccess'))

    }
}
