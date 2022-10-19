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

import { FormProps } from '@rjsf/core';
import { JsonObject } from '@backstage/types';

/**
 * The props for the Step in scaffolder template.
 */
export type Step = {
  schema: JsonObject;
  title: string;
} & Partial<Omit<FormProps<any>, 'schema'>>;

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
