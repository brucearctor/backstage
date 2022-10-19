/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Box, Button, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { Content, StructuredMetadataTable } from '@backstage/core-components';
import { UiSchema } from '@rjsf/core';
import { JsonObject } from '@backstage/types';
import { Step } from '../types';

/**
 * The props for the Last Step in scaffolder template form.
 * Which represents the summary of the input provided by the end user.
 */
export type LastStepFormProps = {
  disableButtons: boolean;
  finishButtonLabel?: string;
  formData: Record<string, any>;
  handleBack: () => void;
  handleCreate: () => void;
  handleReset: () => void;
  onFinish?: () => Promise<void>;
  steps: Step[];
};

export function getUiSchemasFromSteps(steps: Step[]): UiSchema[] {
  const uiSchemas: Array<UiSchema> = [];
  steps.forEach(step => {
    const schemaProps = step.schema.properties as JsonObject;
    for (const key in schemaProps) {
      if (schemaProps.hasOwnProperty(key)) {
        const uiSchema = schemaProps[key] as UiSchema;
        uiSchema.name = key;
        uiSchemas.push(uiSchema);
      }
    }
  });
  return uiSchemas;
}

export function getReviewData(formData: Record<string, any>, steps: Step[]) {
  const uiSchemas = getUiSchemasFromSteps(steps);
  const reviewData: Record<string, any> = {};
  for (const key in formData) {
    if (formData.hasOwnProperty(key)) {
      const uiSchema = uiSchemas.find(us => us.name === key);

      if (!uiSchema) {
        reviewData[key] = formData[key];
        continue;
      }

      if (uiSchema['ui:widget'] === 'password') {
        reviewData[key] = '******';
        continue;
      }

      if (!uiSchema['ui:backstage'] || !uiSchema['ui:backstage'].review) {
        reviewData[key] = formData[key];
        continue;
      }

      const review = uiSchema['ui:backstage'].review as JsonObject;
      if (review.mask) {
        reviewData[key] = review.mask;
        continue;
      }

      if (!review.show) {
        continue;
      }
      reviewData[key] = formData[key];
    }
  }

  return reviewData;
}

/**
 * The component displaying the Last Step in scaffolder template form.
 * Which represents the summary of the input provided by the end user.
 */
export const LastStepForm = (props: LastStepFormProps) => {
  const {
    disableButtons,
    finishButtonLabel,
    formData,
    handleBack,
    handleCreate,
    handleReset,
    onFinish,
    steps,
  } = props;
  return (
    <Content>
      <Paper square elevation={0}>
        <Typography variant="h6">Review and create</Typography>
        <StructuredMetadataTable
          dense
          metadata={getReviewData(formData, steps)}
        />
        <Box mb={4} />
        <Button onClick={handleBack} disabled={disableButtons}>
          Back
        </Button>
        <Button onClick={handleReset} disabled={disableButtons}>
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreate}
          disabled={!onFinish || disableButtons}
        >
          {finishButtonLabel ?? 'Create'}
        </Button>
      </Paper>
    </Content>
  );
};

/**
 * Creates LastStepForm from provided properties.
 *
 * @public
 */
export const lastStepFormComponent = (props: LastStepFormProps) => (
  <LastStepForm {...props} />
);
