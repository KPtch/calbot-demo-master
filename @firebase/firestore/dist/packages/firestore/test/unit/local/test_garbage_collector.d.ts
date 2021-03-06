/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { GarbageCollector } from '../../../src/local/garbage_collector';
import { Persistence } from '../../../src/local/persistence';
import { DocumentKey } from '../../../src/model/document_key';
/**
 * A wrapper around a GarbageCollector that automatically creates a transaction
 * around every operation to reduce test boilerplate.
 */
export declare class TestGarbageCollector {
    persistence: Persistence;
    gc: GarbageCollector;
    constructor(persistence: Persistence, gc: GarbageCollector);
    collectGarbage(): Promise<DocumentKey[]>;
}
