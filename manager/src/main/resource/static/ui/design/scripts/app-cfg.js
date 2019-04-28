/* Copyright 2005-2015 Alfresco Software, Ltd.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * '/uap-0.2/uap/src/main/resources/static/ui/'
 * /uap-0.2/uap/src/main/resources/static/ui/
 * eval("(" + localStorage.getItem("USER") + ")").uap_bpm_url+'/uap-bpm'
 */

'use strict';

var FLOWABLE = FLOWABLE || {};

FLOWABLE.CONFIG = {
	'onPremise' : true,
	'contextRoot' : 'http://192.168.15.12:9090/uap-bpm',
	'webContextRoot' : '/uap-0.2/uap/src/main/resources/static/ui/',///uap-0.2/uap-ui/src/main/webapp/
	'datesLocalization' : false
};
