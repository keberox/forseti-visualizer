// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import ColorConfig from '../constants/ColorConfig';

let ResourceTypeTooltipRenderer = {
    createList: function (dictionary) {
        // expected object: { action: [thingsToDo1, thingsToDo2], action2: [] }
        let listHtml = '<ul>';
        for (let key in dictionary) {
            let value = dictionary[key];

            listHtml += `<li>${key}:</li>`;

            if (value) listHtml += '<li style="list-style-type:none"><ul>';
            for (let subKey in value) {
                let subValue = value[subKey];

                listHtml += `<li>${subValue}</li>`;
            }
            if (value) listHtml += '</li></ul>';
        }
        listHtml += '</ul>';
        return listHtml;
    },

    render: function (violationType, resourceId, violationsMap) {
        switch (violationType) {
            case 'FIREWALL_BLACKLIST_VIOLATION':
                // create list of recommended action
                let recommendedActionsList = this.createList(
                    JSON.parse(violationsMap[resourceId].violation_data).recommended_actions);
                console.log(recommendedActionsList);

                return `
                <div>
                    <h4>${violationsMap[resourceId].violation_type}</h4>
                    ${violationsMap[resourceId].rule_name} has been violated.
                    <br />
                    Recommendations:<br />
                    
                    ${recommendedActionsList}
                </div>`;
            default:
                return `
                <div>
                    <h4>${violationsMap[resourceId].violation_type}</h4>
                    ${violationsMap[resourceId].rule_name}
                    <br />
                    ${JSON.stringify(JSON.parse(violationsMap[resourceId].violation_data))}
                </div>`;
        }
    }
}

let TooltipRenderer = {
    getTooltipHtml: function (violationExists, d, violationsMap) {
        let tooltipContent = '';
        if (violationExists) {
            console.log(violationsMap[d.data.resource_id])

            tooltipContent = ResourceTypeTooltipRenderer.render(violationsMap[d.data.resource_id].violation_type, d.data.resource_id, violationsMap);
        } else { // violation does NOT exist
            tooltipContent = `
                <div class="tooltip-content">
                    <h4>${d.data.resource_name}</h4>
                    ${d.data.resource_data_name}
                    <br />
                    ${d.data.resource_type}
                </div>`;
        }
        return tooltipContent;
    },

    getTooltipBackground: function (violationExists) {
        return violationExists ?
            ColorConfig.DANGER :
            ColorConfig.NODE_BG_COLOR;
    }
};

export default TooltipRenderer;