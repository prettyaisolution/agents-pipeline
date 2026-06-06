#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { AgentsPipelineStack } from '../lib/agents-pipeline-stack';

const app = new cdk.App();
new AgentsPipelineStack(app, 'AgentsPipelineStack', {
    env: {}
});
