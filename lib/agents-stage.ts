import * as cdk from 'aws-cdk-lib/core';
import {Construct} from 'constructs';
import {Environment, StageProps} from "aws-cdk-lib/core";
import {AgentStack} from "./agent-stack";

interface AgentsStageProps extends StageProps {
    env: Environment
}

export class AgentsStage extends cdk.Stage {
    constructor(scope: Construct, id: string, props: AgentsStageProps) {
        super(scope, id, props);

        const myAgent = new AgentStack(this, 'MyAgent', {
            agentName: 'MyAgent'
        })
        const myAgent2 = new AgentStack(this, 'MyAgent2', {
            agentName: 'MyAgent2'
        })
    }
}
