import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Environment, StackProps, Stack} from "aws-cdk-lib/core";
import { CodePipelineSource } from "aws-cdk-lib/pipelines";
import {AgentsStage} from "./agents-stage";


interface AgentsPipelineProps extends StackProps {
    env: Environment
}

export class AgentsPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props: AgentsPipelineProps) {
        super(scope, id, props);

        const pipeline = new cdk.pipelines.CodePipeline(this, 'AgentsPipeline', {
            synth: new cdk.pipelines.ShellStep('Synth', {
                input: CodePipelineSource.connection('PrettyAISolution/agents-pipeline', 'main', {
                    connectionArn: 'arn:aws:codeconnections:us-east-1:123456789012:connection/79c0f02c-c825-421c-ad14-98de8ac2a405',
                    codeBuildCloneOutput: true,
                    triggerOnPush: false,
                }),

                additionalInputs: {
                    '../MyAgent': CodePipelineSource.connection('PrettyAISolution/MyAgent', 'main', {
                        connectionArn: 'arn:aws:codeconnections:us-east-1:123456789012:connection/79c0f02c-c825-421c-ad14-98de8ac2a405',
                        codeBuildCloneOutput: false,
                        triggerOnPush: false,
                    }),
                    '../MyAgent2': CodePipelineSource.connection('PrettyAISolution/MyAgent2', 'main', {
                        connectionArn: 'arn:aws:codeconnections:us-east-1:123456789012:connection/79c0f02c-c825-421c-ad14-98de8ac2a405',
                        codeBuildCloneOutput: false,
                        triggerOnPush: false,
                    }),
                },
                commands: ['npm run build', `npm run cdk synth ${this.stackName}`],
                installCommands: ['npm ci'],
            }),

        })
        const wave = pipeline.addWave('MyWave')
        wave.addStage(new AgentsStage(this, 'dev', {env: props.env}))

    }
}
