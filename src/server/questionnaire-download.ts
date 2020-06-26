// ported from https://github.com/polypoly-eu/qapp/blob/master/server/questionnaire-download.js
import * as POD_ENV from "../../env";
import { pod } from "@polypoly-eu/feature-bootstrap";

/* export const downloadQuestionnaireData = questionnaireId => { */
/*   const statusCheckEndpoint = */
/*     POD_ENV.API_HOME + 'questionnaire/' + questionnaireId + '/content'; */
/*   return timeoutPromise( */
/*     10000, */
/*     fetch(statusCheckEndpoint, { */
/*       headers: { */
/*         'User-Agent': userAgent(), */
/*       }, */
/*     }).then(response => { */
/*       if (response.ok) { */
/*         return response.text(); */
/*       } else { */
/*         let error = new Error(response.statusText); */
/*         error.response = response; */
/*         throw error; */
/*       } */
/*     }), */
/*   ); */
/* }; */

/* export const downloadQuestionnaireResults = questionnaireId => { */
/*   const statusCheckEndpoint = */
/*     POD_ENV.API_HOME + 'questionnaire/' + questionnaireId + '/results'; */
/*   return timeoutPromise( */
/*     10000, */
/*     fetch(statusCheckEndpoint, { */
/*       headers: { */
/*         'User-Agent': userAgent(), */
/*       }, */
/*     }).then(response => { */
/*       if (response.ok) { */
/*         return response.text(); */
/*       } else { */
/*         let error = new Error(response.statusText); */
/*         error.response = response; */
/*         throw error; */
/*       } */
/*     }), */
/*   ); */
/* }; */

export async function downloadActiveQuestionnairesMetadata() {
  const api = await pod;
  const statusCheckEndpoint = POD_ENV.API_HOME + 'questionnaires';

  return api.polyOut.fetch(statusCheckEndpoint, {
    headers: {
      'User-Agent': 'polyPod/1.2.3 (Mac)'
    },
  }).then(response => {
    if (response.ok) {
      return response.text();
    } else {
      let error = new Error(response.statusText);
      /* error.response = response; */
      throw error;
    }
  })
};
