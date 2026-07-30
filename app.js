import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs";

const isSupabaseConfigured = !SUPABASE_URL.startsWith('PASTE_');
const supabase = createClient(
  isSupabaseConfigured ? SUPABASE_URL : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? SUPABASE_ANON_KEY : 'placeholder'
);
const PHOTOS_BUCKET = 'report-photos';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';

const statusBanner = document.getElementById('statusBanner');
if(SUPABASE_URL.startsWith('PASTE_')){
  statusBanner.textContent = '⚠ Supabase is not configured yet — edit supabase-config.js with your project values. See README.md.';
  statusBanner.style.color = '#B8402E';
}

/* ---------- RUBRIC DATA: DIVISION B ---------- */
const SECTIONS_B = [
 {id:'A',title:'Statement of the Problem',part:1,items:[
   {id:'A1',label:'Statement addresses the experiment including variables (not a yes/no question)',scale:[2,1,0],
    guide:'Cannot be a "yes/no" question • must define the specific topic/scope clearly • must include both the IV and DV • must be fully testable with only the materials provided. Score 2 = all four present; 1 = missing one or two; 0 = missing three or four.'}
 ]},
 {id:'B',title:'Hypothesis',part:1,items:[
   {id:'B1',label:'Statement predicts a relationship between the IV & DV',scale:[2,1,0],
    guide:'Must predict a relationship between the IV and DV, naming both variables. Score 2 = both present; 1 = missing one; 0 = missing both.'},
   {id:'B2',label:'Statement gives specific direction to the prediction',scale:[2,1,0],
    guide:'The predicted direction must be specific, not open-ended (state which way the DV will change, not just "a relationship exists"). Scored the same way: 2/1/0 by how many required parts are present.'},
   {id:'B3',label:'A rationale is given for the hypothesis',scale:[2,1,0],
    guide:'A brief scientific rationale must be given for the stand taken, and it must be relevant to the experiment. Score 2 = rationale present and relevant; 1 = missing one part; 0 = missing both.'}
 ]},
 {id:'C',title:'Variables',part:1,items:[
   {id:'C1',label:'IV correctly identified and operationally defined',scale:[3,2,1,0],
    guide:'Exactly one IV, correctly identified as the manipulated/changed variable, and operationally defined to the fullest extent. 3 pts = all parts present; 1 pt deducted per missing part; 0 = all missing.'},
   {id:'C2',label:'Levels of IV given (3+ for full credit)',scale:[3,2,1,0],
    guide:'At least 3 relevant levels of the IV chosen for full credit; fewer relevant levels earn partial credit based on how many are given.'},
   {id:'C3',label:'DV correctly identified and operationally defined',scale:[3,2,1,0],
    guide:'Exactly one DV, directly affected by the IV, correctly identified and operationally defined to the fullest extent. 3 pts = all parts present; 1 pt deducted per missing part; 0 = all missing.'},
   {id:'C4',label:'1st controlled variable correctly identified and relevant',scale:[2,1,0],
    guide:'A variable held constant in this experiment (it could be an IV in a different experiment) is correctly identified and relevant, with its value recorded (qualitative or quantitative, with units if quantitative). Score 2 = both parts; 1 = missing one; 0 = missing both.'},
   {id:'C5',label:'2nd controlled variable correctly identified and relevant',scale:[2,1,0],
    guide:'Same requirements as the 1st controlled variable, applied to a second, distinct controlled variable.'},
   {id:'C6',label:'3rd controlled variable correctly identified and relevant',scale:[2,1,0],
    guide:'Same requirements as the 1st controlled variable, applied to a third, distinct controlled variable.'}
 ]},
 {id:'D',title:'Materials',part:1,items:[
   {id:'D1',label:'All materials used are listed and quantified',scale:[2,1,0],
    guide:'All materials actually used are listed, in list format, and quantified by the amount actually used (not the amount provided). Score 2 = both; 1 = missing one; 0 = missing both.'},
   {id:'D2',label:'No unused or extra materials are listed',scale:[2,1,0],
    guide:'No extra/unused materials listed — including materials that were provided but never used. Score 2 = neither issue; 1 = one issue; 0 = both.'}
 ]},
 {id:'E',title:'Procedure and Set-Up Diagrams',part:1,items:[
   {id:'E1',label:'Procedure is presented in numbered list form',scale:[2,1,0],
    guide:'Numbered list, one step per line — a procedure written as a paragraph or bullet points is NOT acceptable.'},
   {id:'E2',label:'Procedure is in a logical sequence',scale:[2,1,0],
    guide:'Steps are in a logical sequence and all relevant actions performed during the experiment are included.'},
   {id:'E3',label:'Steps for repeated trials are included',scale:[2,1,0],
    guide:'Evidence/steps of repeated trials at each level of the IV are included in the procedure — repeats must be within the same level of the IV, not across different levels.'},
   {id:'E4',label:'Multiple relevant diagrams of setup are provided',scale:[2,1,0],
    guide:'Score 2 = at least two relevant diagrams of the experiment; 1 = only one; 0 = none.'},
   {id:'E5',label:'All diagrams are appropriately labeled with units',scale:[2,1,0],
    guide:'All diagrams are appropriately labeled and include measurements/units for every experimental tool shown.'},
   {id:'E6',label:'Procedure detailed enough to repeat the experiment accurately',scale:[3,2,1,0],
    guide:'Detailed enough for someone else to repeat accurately • no unclear assumptions • no reasonable questions left after reading • evidence of specific quantitative and qualitative data actually collected. 3 pts = all present; 1 pt deducted per missing part; 0 = missing 4+.'}
 ]},
 {id:'F',title:'Qualitative Observations',part:1,items:[
   {id:'F1',label:'Observations about the set-up are provided',scale:[2,1,0],
    guide:'Full credit needs ≥2 observations specific to the experiment (e.g. is the surrounding area controlled or exposed to outside elements? do all components fit properly?). No quantitative/numeric values belong in this section — a numeric value here (other than describing IV levels) causes a deduction.'},
   {id:'F2',label:'Observations about the procedure are provided',scale:[2,1,0],
    guide:'Full credit needs ≥2 observations (e.g. what worked well? what didn’t? were modifications needed? any unexpected irregularities?). Qualitative only.'},
   {id:'F3',label:'Observations about the results are provided',scale:[2,1,0],
    guide:'Full credit needs ≥2 observations (e.g. were results as expected? any outliers and why? is there a trend?). Qualitative only.'}
 ]},
 {id:'G',title:'Quantitative Data - Data Table',part:1,items:[
   {id:'G1',label:'All raw data provided with units and labels',scale:[3,2,1,0],
    guide:'All quantitative (numbers-based) data, with units, in a properly labeled table; every data point actually measured must be included. 1 pt deducted per missing part; 0 = missing 2+.'},
   {id:'G2',label:'Condensed data table (only data to be graphed), one sample calc per derived variable',scale:[2,1,0],
    guide:'A second, condensed table with only the data to be graphed (may include derived variables); any derived variable used must show an example calculation.'}
 ]},
 {id:'H',title:'Graph',part:2,items:[
   {id:'H1',label:'Appropriate graph type is provided for the data',scale:[4,3,2,1,0],
    guide:'If the IV is qualitative, don’t use a line graph/scatterplot; if quantitative, a line graph/scatterplot is usually better than a bar graph. IV on the x-axis, DV on the y-axis (swapping axes costs 1 point). 4 = proper type; 3 = good but not fully appropriate; 2 = a graph present but not the best type; 1 = readable but wrong type; 0 = no graph.'},
   {id:'H2',label:'Graph properly titled and axes labeled',scale:[4,3,2,1,0],
    guide:'Descriptive relevant title • x-axis heading = IV with units • y-axis heading = DV with units • a legend with an appropriate title if multiple series/symbols are used. 1 pt deducted per missing part; 0 if all missing.'},
   {id:'H3',label:'Appropriate scale and units included, no axis breaks',scale:[4,3,2,1,0],
    guide:'All data include units (on each point or in axis headings); scale best uses the space provided; no axis breaks, both axes continuous. Missing a unit costs 1 pt each (up to all 4); a scale that shrinks the graph or breaks an axis costs 2 pts.'}
 ]},
 {id:'I',title:'Statistics',part:2,items:[
   {id:'I1',label:'Statistics of Central Tendency used (3 for full credit)',scale:[3,2,1,0],
    guide:'Central-tendency stats (mean, median, mode, line of best fit, percent error) calculated for every IV level. Full credit needs 3 distinct measures calculated correctly across all levels; 2 pts deducted for any level improperly measured, 1 pt deducted per measure short of 3.'},
   {id:'I2',label:'Example calculation given for each central-tendency stat, with units',scale:[2,1,0],
    guide:'At least one example calculation with units shown for each central-tendency statistic used; partial credit lost per statistic missing a sample calculation.'},
   {id:'I3',label:'Statistics of variation included',scale:[2,1,0],
    guide:'Variation stats (standard deviation — must be sample, not population, to count; IQR; range with min/max; frequency table; z-score; confidence interval) calculated across every IV level.'},
   {id:'I4',label:'Example calculation given for each variation stat, with units',scale:[2,1,0],
    guide:'At least one example calculation with units shown for each variation statistic used; partial credit lost per statistic missing a sample calculation.'},
   {id:'I5',label:'Two additional accurately calculated statistics included',scale:[2,1,0],stateOnly:true,
    guide:'State/Nationals only: two further statistics beyond what was already used above (e.g. two more central-tendency or variation measures, or another appropriate statistical test), calculated accurately.'}
 ]},
 {id:'J',title:'Possible Experimental Errors',part:2,items:[
   {id:'J1',label:'1st specific error identified & effect on results discussed',scale:[3,2,1,0],
    guide:'A specific error (Random — from limited instrument precision; Procedure — a known experimenter mistake or faulty procedure; or Systematic — from faulty equipment, usually consistently off) must be identified and categorized by type, with its effect on the resulting data AND on the data trend both discussed. 1 pt deducted per missing part; 0 = missing all parts.'},
   {id:'J2',label:'2nd specific error identified & effect on results discussed',scale:[3,2,1,0],
    guide:'Same requirements as the 1st error, applied to a second, distinct error.'}
 ]},
 {id:'K',title:'Analysis of Claim/Evidence/Reason',part:2,items:[
   {id:'K1',label:'Data trend — claim completed logically',scale:[2,1,0],
    guide:'Claim: the effect the IV appears to have on the DV, according to the data. Score 2 = a proper claim about the data trend; 1 = missing a required part; 0 = missing both.'},
   {id:'K2',label:'Data trend — evidence completed logically',scale:[2,1,0],
    guide:'Evidence for the data trend claim — e.g. slope of the line of best fit or other calculated statistics. Should be quantitative.'},
   {id:'K3',label:'Data trend — reasoning completed logically',scale:[2,1,0],
    guide:'Reasoning ties the data-trend claim to its evidence into a data-driven conclusion.'},
   {id:'K4',label:'Outliers — claim completed logically',scale:[2,1,0],
    guide:'Claim about any outliers present in the data.'},
   {id:'K5',label:'Outliers — evidence completed logically',scale:[2,1,0],
    guide:'Evidence for the outlier claim should include a quantitative outlier measure (e.g. 1.5×IQR beyond Q1/Q3, or another defended measure).'},
   {id:'K6',label:'Outliers — reasoning completed logically',scale:[2,1,0],
    guide:'Reasoning ties the outlier claim to its evidence.'},
   {id:'K7',label:'Variation — claim completed logically',scale:[2,1,0],stateOnly:true,
    guide:'State/Nationals only: a claim specifically about the variation in the data (distinct from the overall data trend).'},
   {id:'K8',label:'Variation — evidence completed logically',scale:[2,1,0],stateOnly:true,
    guide:'State/Nationals only: evidence supporting the variation claim.'},
   {id:'K9',label:'Variation — reasoning completed logically',scale:[2,1,0],stateOnly:true,
    guide:'State/Nationals only: reasoning tying the variation claim to its evidence.'}
 ]},
 {id:'L',title:'Conclusion',part:2,items:[
   {id:'L1',label:'Hypothesis is restated',scale:[2,1,0],
    guide:'Hypothesis must be restated exactly as written — no rewording. Score 2 = restated as-is; 1 = restated but changed from the original; 0 = not restated.'},
   {id:'L2',label:'Hypothesis — claim completed logically',scale:[2,1,0],
    guide:'Claim: does the data support the hypothesis? (The hypothesis can’t be "proven" right or wrong — evidence either supports or doesn’t support it.)'},
   {id:'L3',label:'Hypothesis — evidence completed logically',scale:[2,1,0],
    guide:'Evidence supporting the hypothesis claim.'},
   {id:'L4',label:'Hypothesis — reasoning completed logically',scale:[2,1,0],
    guide:'Reasoning ties the hypothesis claim to its evidence into a data-driven conclusion.'}
 ]},
 {id:'M',title:'Applications and Recommendations',part:2,items:[
   {id:'M1',label:'Suggestions to improve the experiment, with rationale (4 needed; 3 at Regionals)',scale:[4,3,2,1,0],regionalMax:3,
    guide:'At least 4 distinct, specific suggestions to improve THIS experiment, each with a rationale — generic answers like "more time" or "better equipment" don’t count. Scored by count of good suggestions given (capped at 3 for Regionals).'},
   {id:'M2',label:'Suggestions for practical applications (4 needed; 2 at Regionals)',scale:[4,3,2,1,0],regionalMax:2,
    guide:'At least 4 suggestions for real-world/practical applications of this experiment. Scored by count (capped at 2 for Regionals).'},
   {id:'M3',label:'Suggestions for future experiments (4 needed; 3 at Regionals)',scale:[4,3,2,1,0],regionalMax:3,
    guide:'At least 4 suggestions for how this experiment could be adapted into a DIFFERENT future experiment. Scored by count (capped at 3 for Regionals).'}
 ]}
];

/* ---------- RUBRIC DATA: DIVISION C ---------- */
const SECTIONS_C = [
 {id:'A',title:'Statement of the Problem',part:1,items:[
   {id:'A1',label:'Statement addresses the experiment including variables (not a yes/no question)',scale:[2,1,0],
    guide:'Cannot be a "yes/no" question • must define the specific topic/scope clearly • must include both the IV and DV • must be fully testable with only the materials provided. Score 2 = all four present; 1 = missing one or two; 0 = missing three or four.'}
 ]},
 {id:'B',title:'Hypothesis',part:1,items:[
   {id:'B1',label:'Statement predicts a relationship between the IV & DV',scale:[2,1,0],
    guide:'Must predict a relationship between the IV and DV, naming both variables. Score 2 = both present; 1 = missing one; 0 = missing both.'},
   {id:'B2',label:'Statement gives specific direction to the prediction',scale:[2,1,0],
    guide:'The predicted direction must be specific, not open-ended. Scored the same way: 2/1/0 by how many required parts are present.'},
   {id:'B3',label:'A rationale is given for the hypothesis',scale:[2,1,0],
    guide:'A brief scientific rationale must be given for the stand taken, and it must be relevant to the experiment. Score 2 = rationale present and relevant; 1 = missing one part; 0 = missing both.'}
 ]},
 {id:'C',title:'Variables',part:1,items:[
   {id:'C1',label:'IV correctly identified and operationally defined',scale:[3,2,1,0],
    guide:'Exactly one IV, correctly identified as the manipulated/changed variable, and operationally defined to the fullest extent. 1 pt deducted per missing part; 0 = all missing.'},
   {id:'C2',label:'Levels of IV given (4+ for full credit)',scale:[4,3,2,1,0],
    guide:'At least 4 relevant levels of the IV chosen for full credit; fewer relevant levels earn partial credit based on how many are given.'},
   {id:'C3',label:'DV correctly identified and operationally defined',scale:[3,2,1,0],
    guide:'Exactly one DV, directly affected by the IV, correctly identified and operationally defined to the fullest extent. 1 pt deducted per missing part; 0 = all missing.'},
   {id:'C4',label:'1st controlled variable correctly identified and relevant',scale:[2,1,0],
    guide:'A variable held constant in this experiment (it could be an IV in a different experiment) is correctly identified and relevant, with its value recorded (qualitative or quantitative, with units if quantitative).'},
   {id:'C5',label:'2nd controlled variable correctly identified and relevant',scale:[2,1,0],
    guide:'Same requirements as the 1st controlled variable, applied to a second, distinct controlled variable.'},
   {id:'C6',label:'3rd controlled variable correctly identified and relevant',scale:[2,1,0],
    guide:'Same requirements as the 1st controlled variable, applied to a third, distinct controlled variable.'},
   {id:'C7',label:'Constant correctly identified and relevant, with units',scale:[2,1,0],
    guide:'A constant is a fundamental value that does NOT change under any condition (not the same as a controlled variable, and not a specific application of a constant in one environment). Must be relevant and have correct units. Score 2 = both parts; 1 = missing one; 0 = missing both.'}
 ]},
 {id:'D',title:'Experimental Control (Standard of Comparison)',part:1,items:[
   {id:'D1',label:'SOC logically identified for the experiment',scale:[2,1,0],
    guide:'The Standard of Comparison (SOC) is logically identified — it’s the value of the DV when the IV is set to a specific value (usually the absence/minimization of the IV); this value may be one of the IV’s own levels.'},
   {id:'D2',label:'Reason given for selection of SOC',scale:[2,1,0],
    guide:'A rationale is given for why that IV/DV value was chosen as the SOC (the SOC also helps detect/measure hidden variability); the rationale must be reasonable and relevant.'}
 ]},
 {id:'E',title:'Materials',part:1,items:[
   {id:'E1',label:'All materials used are listed and quantified',scale:[2,1,0],
    guide:'All materials actually used are listed, in list format, and quantified by the amount actually used (not the amount provided).'},
   {id:'E2',label:'No unused or extra materials are listed',scale:[2,1,0],
    guide:'No extra/unused materials listed — including materials that were provided but never used.'}
 ]},
 {id:'F',title:'Procedure and Set-Up Diagrams',part:1,items:[
   {id:'F1',label:'Procedure is presented in numbered list form',scale:[2,1,0],
    guide:'Numbered list, one step per line — a procedure written as a paragraph or bullet points is NOT acceptable.'},
   {id:'F2',label:'Procedure is in a logical sequence',scale:[2,1,0],
    guide:'Steps are in a logical sequence and all relevant actions performed during the experiment are included.'},
   {id:'F3',label:'Steps for repeated trials are included',scale:[2,1,0],
    guide:'Evidence/steps of repeated trials at each level of the IV are included — repeats must be within the same level of the IV, not across different levels.'},
   {id:'F4',label:'Multiple relevant diagrams of setup are provided',scale:[2,1,0],
    guide:'Score 2 = at least two relevant diagrams of the experiment; 1 = only one; 0 = none.'},
   {id:'F5',label:'All diagrams are appropriately labeled with units',scale:[2,1,0],
    guide:'All diagrams are appropriately labeled and include measurements/units for every experimental tool shown.'},
   {id:'F6',label:'Procedure detailed enough to repeat the experiment accurately',scale:[3,2,1,0],
    guide:'Detailed enough for someone else to repeat accurately • no unclear assumptions • no reasonable questions left after reading • evidence of specific quantitative and qualitative data actually collected • evidence of how the SOC was determined and measured. 1 pt deducted per missing part; 0 = missing 4+.'}
 ]},
 {id:'G',title:'Qualitative Observations',part:1,items:[
   {id:'G1',label:'Observations about the set-up are provided',scale:[2,1,0],
    guide:'Full credit needs ≥2 observations specific to the experiment (e.g. is the surrounding area controlled or exposed to outside elements? do all components fit properly?). No quantitative/numeric values belong in this section.'},
   {id:'G2',label:'Observations about the procedure are provided',scale:[2,1,0],
    guide:'Full credit needs ≥2 observations (e.g. what worked well? what didn’t? were modifications needed? any unexpected irregularities?). Qualitative only.'},
   {id:'G3',label:'Observations about the results are provided',scale:[2,1,0],
    guide:'Full credit needs ≥2 observations (e.g. were results as expected? any outliers and why? is there a trend?). Qualitative only.'}
 ]},
 {id:'H',title:'Quantitative Data - Data Table',part:1,items:[
   {id:'H1',label:'All raw data provided with units and labels',scale:[3,2,1,0],
    guide:'All quantitative data, with units, in a properly labeled table; every data point actually measured must be included. 1 pt deducted per missing part; 0 = missing 2+.'},
   {id:'H2',label:'Condensed data table (only data to be graphed), one sample calc per derived variable',scale:[2,1,0],
    guide:'A second, condensed table with only the data to be graphed (may include derived variables); any derived variable used must show an example calculation.'},
   {id:'H3',label:'Significant figure rules properly applied to table',scale:[2,1,0],
    guide:'Internationally accepted significant-figure rules applied correctly to both the raw and condensed data tables.'}
 ]},
 {id:'I',title:'Graph',part:2,items:[
   {id:'I1',label:'Appropriate graph type is provided for the data',scale:[4,3,2,1,0],
    guide:'If the IV is qualitative, don’t use a line graph/scatterplot; if quantitative, a line graph/scatterplot is usually better than a bar graph. IV on the x-axis, DV on the y-axis (swapping axes costs 1 point). 4 = proper type; 3 = good but not fully appropriate; 2 = present but not the best type; 1 = readable but wrong type; 0 = no graph.'},
   {id:'I2',label:'Graph properly titled and axes labeled',scale:[4,3,2,1,0],
    guide:'Descriptive relevant title • x-axis heading = IV with units • y-axis heading = DV with units • a legend with an appropriate title if multiple series/symbols are used. 1 pt deducted per missing part.'},
   {id:'I3',label:'Appropriate scale and units included, no axis breaks',scale:[4,3,2,1,0],
    guide:'All data include units; scale best uses the space provided; no axis breaks, both axes continuous. Missing a unit costs 1 pt each (up to all 4); a scale that shrinks the graph or breaks an axis costs 2 pts.'}
 ]},
 {id:'J',title:'Statistics',part:2,items:[
   {id:'J1',label:'Statistics of Central Tendency used (3 required; 4 for full credit at states)',scale:[4,3,2,1,0],regionalMax:3,
    guide:'Central-tendency stats (mean, median, mode, line of best fit, percent error) calculated for every IV level. Full credit (4 at states, 3 at regionals) needs that many distinct measures calculated correctly across all levels; 2 pts deducted for any level improperly measured, 1 pt deducted per measure short of the minimum.'},
   {id:'J2',label:'Example calculation given for each central-tendency stat, with units',scale:[2,1,0],
    guide:'At least one example calculation with units shown for each central-tendency statistic used; partial credit lost per statistic missing a sample calculation.'},
   {id:'J3',label:'Statistics of variation included (2 required; 4 for full credit at states)',scale:[4,3,2,1,0],regionalMax:2,
    guide:'Variation stats (standard deviation — must be sample, not population; IQR; range with min/max; frequency table; z-score; confidence interval) calculated for every IV level. Full credit needs at least three distinct measures at states (two at regionals); 2 pts deducted for any level improperly measured, 1 pt deducted per measure short of the minimum.'},
   {id:'J4',label:'Example calculation given for each variation stat, with units',scale:[2,1,0],
    guide:'At least one example calculation with units shown for each variation statistic used; partial credit lost per statistic missing a sample calculation.'},
   {id:'J5',label:'Significant figure rules properly applied to statistics',scale:[2,1,0],
    guide:'All calculated statistics hold accurate precision per significant-figure rules. Score 2 = every calculation accurate; 1 = at most one error; 0 = two or more errors.'}
 ]},
 {id:'K',title:'Possible Experimental Errors',part:2,items:[
   {id:'K1',label:'1st specific error identified & effect on results discussed',scale:[3,2,1,0],
    guide:'A specific error (Random — from limited instrument precision; Procedure — a known experimenter mistake or faulty procedure; or Systematic — from faulty equipment, usually consistently off) must be identified and categorized by type, with its effect on the resulting data AND on the data trend both discussed. 1 pt deducted per missing part; 0 = missing all parts.'},
   {id:'K2',label:'2nd specific error identified & effect on results discussed',scale:[3,2,1,0],
    guide:'Same requirements as the 1st error, applied to a second, distinct error.'}
 ]},
 {id:'L',title:'Analysis of Claim/Evidence/Reason',part:2,items:[
   {id:'L1',label:'Variation — claim completed logically',scale:[2,1,0],stateOnly:true,
    guide:'State/Nationals only: a claim specifically about the variation in the data (distinct from the overall data trend).'},
   {id:'L2',label:'Variation — evidence completed logically',scale:[2,1,0],stateOnly:true,
    guide:'State/Nationals only: evidence supporting the variation claim.'},
   {id:'L3',label:'Variation — reasoning completed logically',scale:[2,1,0],stateOnly:true,
    guide:'State/Nationals only: reasoning tying the variation claim to its evidence.'},
   {id:'L4',label:'Outliers — claim completed logically',scale:[2,1,0],
    guide:'Claim about any outliers present in the data.'},
   {id:'L5',label:'Outliers — evidence completed logically',scale:[2,1,0],
    guide:'Evidence for the outlier claim should include a quantitative outlier measure (e.g. 1.5×IQR beyond Q1/Q3, or another defended measure).'},
   {id:'L6',label:'Outliers — reasoning completed logically',scale:[2,1,0],
    guide:'Reasoning ties the outlier claim to its evidence.'},
   {id:'L7',label:'Data trend — claim completed logically',scale:[2,1,0],
    guide:'Claim: the effect the IV appears to have on the DV, according to the data.'},
   {id:'L8',label:'Data trend — evidence completed logically',scale:[2,1,0],
    guide:'Evidence for the data trend claim — e.g. slope of the line of best fit or other calculated statistics. Should be quantitative.'},
   {id:'L9',label:'Data trend — reasoning completed logically',scale:[2,1,0],
    guide:'Reasoning ties the data-trend claim to its evidence into a data-driven conclusion.'}
 ]},
 {id:'M',title:'Conclusion',part:2,items:[
   {id:'M1',label:'Hypothesis is restated',scale:[2,1,0],
    guide:'Hypothesis must be restated exactly as written — no rewording. Score 2 = restated as-is; 1 = restated but changed; 0 = not restated.'},
   {id:'M2',label:'Hypothesis — claim completed logically',scale:[2,1,0],
    guide:'Claim: does the data support the hypothesis? (The hypothesis can’t be "proven" right or wrong — evidence either supports or doesn’t support it.)'},
   {id:'M3',label:'Hypothesis — evidence completed logically',scale:[2,1,0],
    guide:'Evidence supporting the hypothesis claim.'},
   {id:'M4',label:'Hypothesis — reasoning completed logically',scale:[2,1,0],
    guide:'Reasoning ties the hypothesis claim to its evidence into a data-driven conclusion.'}
 ]},
 {id:'N',title:'Applications and Recommendations for Further Use',part:2,items:[
   {id:'N1',label:'Suggestions to improve the experiment, with rationale (4 needed; 3 at Regionals)',scale:[4,3,2,1,0],regionalMax:3,
    guide:'At least 4 distinct, specific suggestions to improve THIS experiment, each with a rationale — generic answers like "more time" or "better equipment" don’t count. Scored by count of good suggestions given.'},
   {id:'N2',label:'Suggestions for practical applications (4 needed; 2 at Regionals)',scale:[4,3,2,1,0],regionalMax:2,
    guide:'At least 4 suggestions for real-world/practical applications of this experiment. Scored by count.'},
   {id:'N3',label:'Suggestions for future experiments (4 needed; 3 at Regionals)',scale:[4,3,2,1,0],regionalMax:3,
    guide:'At least 4 suggestions for how this experiment could be adapted into a DIFFERENT future experiment. Scored by count.'}
 ]},
 {id:'O',title:'Abstract',part:2,items:[
   {id:'O1',label:'Contains the statement of the problem, hypothesis, and practical application',scale:[3,2,1,0],stateOnly:true,
    guide:'State/Nationals only. The statement of the problem and hypothesis must match sections A and B verbatim; a practical application must also be stated. 1 pt deducted per missing part.'},
   {id:'O2',label:'Summarizes the procedure, data trend, is well organized',scale:[3,2,1,0],stateOnly:true,
    guide:'State/Nationals only. Includes the research procedure, summarized (not as a numbered list) covering the most important parts, plus the major data trend findings. 1 pt deducted per missing part.'},
   {id:'O3',label:'Discussion of errors and improvements',scale:[4,3,2,1,0],stateOnly:true,
    guide:'State/Nationals only. The conclusion must match section M; a CER of the conclusion is summarized; discussion of errors and their effect on conclusions; potential improvements (from section N) are mentioned. 1 pt deducted per missing part.'}
 ]}
];

const TIEBREAK = {
  B: 'K → E → C → G → H',
  C: 'L → F → C → H → I'
};

const DIVISIONS = { B: SECTIONS_B, C: SECTIONS_C };

/* ---------- APP STATE ---------- */
const urlParams = new URLSearchParams(location.search);
let division = urlParams.get('division') || localStorage_safeGet('last-division') || 'B';
if(division!=='B' && division!=='C') division = 'B';
let level = 'regional';
let roster = [];
let currentTeamNumber = null;
let scores = {};
let images = [];        // in-memory working set: [{mediaType, base64, url?, storagePath?}]
let finalized = false;
let saveTimer = null;
let pendingSave = false;
let currentSectionIdx = 0;
let currentImageIdx = 0;
let sectionPageIndex = {}; // {sectionId: imageIdx} - "pinned" page per rubric section

function SECTIONS(){ return DIVISIONS[division]; }
function visibleSections(){ return SECTIONS().filter(sec=>sec.items.some(isVisible)); }
function isVisible(item){ return !(level==='regional' && item.stateOnly); }
function effScale(item){
  if(level==='regional' && item.regionalMax!=null) return item.scale.filter(v=>v<=item.regionalMax);
  return item.scale;
}
function effMax(item){ return effScale(item)[0] ?? 0; }
function partMax(part){
  let total=0;
  SECTIONS().filter(s=>s.part===part).forEach(sec=> sec.items.filter(isVisible).forEach(it=> total+=effMax(it)));
  return total;
}
function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }
function localStorage_safeGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function localStorage_safeSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }

/* ---------- SECTION STEPPER RENDER ---------- */
const root = document.getElementById('sectionStepper');
function renderSectionStepper(){
  const sections = visibleSections();
  if(currentSectionIdx>=sections.length) currentSectionIdx = sections.length-1;
  if(currentSectionIdx<0) currentSectionIdx = 0;
  const sec = sections[currentSectionIdx];
  const visItems = sec.items.filter(isVisible);
  const secMax = visItems.reduce((s,it)=>s+effMax(it),0);
  const secScore = visItems.reduce((s,it)=>s+(scores[it.id]??0),0);

  const tabsHTML = sections.map((s,i)=>
    `<button class="section-tab ${i===currentSectionIdx?'active':''}" data-idx="${i}">${s.id}</button>`
  ).join('');

  const itemsHTML = visItems.map(item=>{
    const scaleHTML = effScale(item).map(v=>{
      const sel = scores[item.id]===v ? 'selected':'';
      return `<button class="scale-btn large ${sel}" data-item="${item.id}" data-val="${v}">${v}</button>`;
    }).join('');
    const guideHTML = item.guide ? `<div class="stepper-item-guide">${escapeHtml(item.guide)}</div>` : '';
    return `<div class="stepper-item" tabindex="0" data-item-id="${item.id}"><div class="stepper-item-label">${item.label}</div>${guideHTML}<div class="stepper-item-scale">${scaleHTML}</div></div>`;
  }).join('');

  root.innerHTML = `
    <div class="section-tabs">${tabsHTML}</div>
    <div class="part-heading"><h2>${sec.part===1?'Part I — Design & Construction':'Part II — Data, Analysis & Conclusions'}</h2><span class="max">/ ${partMax(sec.part)} pts</span></div>
    <div class="stepper-section-head"><h3><span class="letter">${sec.id}</span>${sec.title}</h3><span class="totals mono">${secScore} / ${secMax}</span></div>
    <div class="stepper-items">${itemsHTML}</div>
    <div class="stepper-nav">
      <button class="btn ghost" id="prevSectionBtn" ${currentSectionIdx===0?'disabled':''}>← Previous</button>
      <span class="stepper-progress mono">Section ${currentSectionIdx+1} of ${sections.length}</span>
      <button class="btn teal" id="nextSectionBtn" ${currentSectionIdx===sections.length-1?'disabled':''}>Next →</button>
    </div>
  `;

  root.querySelectorAll('.section-tab').forEach(b=>b.addEventListener('click',()=>{
    goToSection(Number(b.dataset.idx));
  }));
  root.querySelectorAll('.scale-btn').forEach(b=>b.addEventListener('click',()=>{
    const id=b.dataset.item, val=Number(b.dataset.val);
    scores[id] = (scores[id]===val) ? null : val;
    renderSectionStepper(); updateTotals(); queueSave();
    // re-render rebuilds the DOM, which drops focus — restore it to the same
    // item (by id) so repeated keyboard scoring keeps working on it.
    const refocus = root.querySelector(`.stepper-item[data-item-id="${id}"]`);
    if(refocus) refocus.focus();
  }));
  document.getElementById('prevSectionBtn').addEventListener('click',()=>{ if(currentSectionIdx>0) goToSection(currentSectionIdx-1,'prev'); });
  document.getElementById('nextSectionBtn').addEventListener('click',()=>{ if(currentSectionIdx<sections.length-1) goToSection(currentSectionIdx+1,'next'); });
}

function goToSection(idx, direction){
  currentSectionIdx = idx;
  const sec = visibleSections()[idx];
  if(sec){
    const pinned = sectionPageIndex[sec.id];
    if(pinned!=null && pinned<images.length){
      currentImageIdx = pinned;
    } else {
      if(direction==='next' && currentImageIdx<images.length-1) currentImageIdx++;
      else if(direction==='prev' && currentImageIdx>0) currentImageIdx--;
      // else (direct tab-click jump, no pin yet): carry forward whatever page
      // is showing rather than guessing.
      //
      // Either way, remember this as the section's page now, on first visit —
      // so coming back to this section later (Next, Previous, or a tab click)
      // always shows the same page consistently, not a re-derived guess that
      // could differ depending on which direction you approached it from.
      sectionPageIndex[sec.id] = currentImageIdx;
      queueSave();
    }
  }
  renderSectionStepper();
  renderMainImage(); renderThumbs();
}

function reconcileSectionIndex(prevSectionId){
  const sections = visibleSections();
  let idx = sections.findIndex(s=>s.id===prevSectionId);
  if(idx===-1) idx = Math.min(currentSectionIdx, sections.length-1);
  currentSectionIdx = Math.max(0, idx);
}

function updateTotals(){
  const p1max=partMax(1), p2max=partMax(2);
  let p1=0,p2=0;
  SECTIONS().forEach(sec=> sec.items.filter(isVisible).forEach(it=>{
    const v=scores[it.id]??0; if(sec.part===1) p1+=v; else p2+=v;
  }));
  document.getElementById('totPart1').textContent = `${p1} / ${p1max}`;
  document.getElementById('totPart2').textContent = `${p2} / ${p2max}`;
  const raw = p1+p2;
  document.getElementById('totRaw').textContent = raw;
  const matM = document.getElementById('multMaterials').checked?0.95:1;
  const fakeM = document.getElementById('multFake').checked?0.25:1;
  const offM = Number(document.getElementById('multOffTopic').value);
  const mult = matM*fakeM*offM;
  document.getElementById('totMult').textContent = `×${mult.toFixed(2)}`;
  const final = (raw*mult);
  document.getElementById('totFinal').textContent = final.toFixed(2);
  updateReport(p1max,p2max,raw,mult,final);
  updateRosterScoreDisplay(final);
}

function updateReport(p1max,p2max,raw,mult,final){
  const teamName = (roster.find(r=>r.number===currentTeamNumber)||{}).name || '';
  let lines = [];
  lines.push(`Rickards Invitational — Experimental Design (Division ${division})`);
  lines.push(`Team ${currentTeamNumber||'—'}${teamName?' — '+teamName:''}`);
  lines.push('');
  visibleSections().forEach(sec=>{
    const vis = sec.items.filter(isVisible);
    const max = vis.reduce((s,it)=>s+effMax(it),0);
    const got = vis.reduce((s,it)=>s+(scores[it.id]??0),0);
    lines.push(`${sec.id}. ${sec.title}: ${got} / ${max}`);
  });
  lines.push('');
  lines.push(`Raw Total: ${raw} / ${p1max+p2max}`);
  lines.push(`Multiplier: ×${mult.toFixed(2)}`);
  lines.push(`Final Score: ${final.toFixed(2)}`);
  document.getElementById('reportText').value = lines.join('\n');
}
document.getElementById('copyReportBtn').addEventListener('click', async ()=>{
  const ta = document.getElementById('reportText');
  try{ await navigator.clipboard.writeText(ta.value); }
  catch(e){ ta.select(); document.execCommand('copy'); }
  const btn = document.getElementById('copyReportBtn');
  const old = btn.textContent; btn.textContent='Copied!'; setTimeout(()=>btn.textContent=old,1200);
});

document.getElementById('levelToggle').addEventListener('click',(e)=>{
  const btn=e.target.closest('button'); if(!btn) return;
  const prevSecId = visibleSections()[currentSectionIdx]?.id;
  level = btn.dataset.level;
  document.querySelectorAll('#levelToggle button').forEach(b=>b.classList.toggle('active',b===btn));
  saveLevel();
  reconcileSectionIndex(prevSecId);
  renderSectionStepper(); updateTotals(); queueSave();
});
['multMaterials','multFake'].forEach(id=>document.getElementById(id).addEventListener('change',()=>{updateTotals(); queueSave();}));
document.getElementById('multOffTopic').addEventListener('input',(e)=>{
  document.getElementById('offTopicVal').textContent = Number(e.target.value).toFixed(2);
  updateTotals(); queueSave();
});

/* ---------- IMAGE HANDLING ---------- */
const dropZone=document.getElementById('dropZone'), fileInput=document.getElementById('fileInput');
const imgThumbs=document.getElementById('imgThumbs');
const mainImageWrap=document.getElementById('mainImageWrap'), pageIndicator=document.getElementById('pageIndicator');
const prevPageBtn=document.getElementById('prevPageBtn'), nextPageBtn=document.getElementById('nextPageBtn');

dropZone.addEventListener('click',()=>{ if(!finalized) fileInput.click(); });
dropZone.addEventListener('dragover',(e)=>{e.preventDefault(); if(!finalized) dropZone.classList.add('dragover');});
dropZone.addEventListener('dragleave',()=>dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop',(e)=>{e.preventDefault(); dropZone.classList.remove('dragover'); if(!finalized) handleFiles(e.dataTransfer.files);});
fileInput.addEventListener('change',()=>handleFiles(fileInput.files));
prevPageBtn.addEventListener('click',()=>{ if(currentImageIdx>0){ currentImageIdx--; pinCurrentPage(); renderMainImage(); renderThumbs(); } });
nextPageBtn.addEventListener('click',()=>{ if(currentImageIdx<images.length-1){ currentImageIdx++; pinCurrentPage(); renderMainImage(); renderThumbs(); } });

function pinCurrentPage(){
  const sec = visibleSections()[currentSectionIdx];
  if(sec){ sectionPageIndex[sec.id] = currentImageIdx; queueSave(); }
}

function compressImage(file){
  return new Promise((resolve)=>{
    const img = new Image();
    const reader = new FileReader();
    reader.onload = ()=>{ img.onload = ()=>{
      const maxDim = 1500;
      let {width,height} = img;
      if(width>height && width>maxDim){ height*=maxDim/width; width=maxDim; }
      else if(height>maxDim){ width*=maxDim/height; height=maxDim; }
      const canvas=document.createElement('canvas'); canvas.width=width; canvas.height=height;
      canvas.getContext('2d').drawImage(img,0,0,width,height);
      const dataUrl = canvas.toDataURL('image/jpeg',0.72);
      resolve({mediaType:'image/jpeg', base64:dataUrl.split(',')[1], dataUrl});
    }; img.src = reader.result; };
    reader.readAsDataURL(file);
  });
}
async function rasterizePdf(file){
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({data: buf}).promise;
  const pages = [];
  for(let i=1;i<=pdf.numPages;i++){
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({scale:2});
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width; canvas.height = viewport.height;
    await page.render({canvasContext: canvas.getContext('2d'), viewport}).promise;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
    pages.push({mediaType:'image/jpeg', base64: dataUrl.split(',')[1], dataUrl});
  }
  return pages;
}
async function handleFiles(list){
  for(const f of Array.from(list)){
    const isPdf = (f.type||'').includes('pdf') || f.name.toLowerCase().endsWith('.pdf');
    if(isPdf){
      const pages = await rasterizePdf(f);
      images.push(...pages);
    } else {
      images.push(await compressImage(f));
    }
  }
  currentImageIdx = images.length-1;
  renderThumbs(); renderMainImage();
  await uploadNewImagesToStorage();
}
function renderMainImage(){
  if(images.length===0){
    mainImageWrap.innerHTML = '<div class="empty-note">No pages uploaded yet.</div>';
    pageIndicator.textContent = '';
    prevPageBtn.disabled = true; nextPageBtn.disabled = true;
    return;
  }
  if(currentImageIdx>=images.length) currentImageIdx = images.length-1;
  if(currentImageIdx<0) currentImageIdx = 0;
  const im = images[currentImageIdx];
  const src = im.url || `data:${im.mediaType};base64,${im.base64}`;
  mainImageWrap.innerHTML = `<img src="${src}">`;
  mainImageWrap.querySelector('img').addEventListener('click',()=>openLightbox(src));
  pageIndicator.textContent = `Page ${currentImageIdx+1} of ${images.length}`;
  prevPageBtn.disabled = currentImageIdx===0;
  nextPageBtn.disabled = currentImageIdx===images.length-1;
}
function renderThumbs(){
  imgThumbs.innerHTML='';
  images.forEach((im,i)=>{
    const src = im.url || `data:${im.mediaType};base64,${im.base64}`;
    const wrap=document.createElement('div'); wrap.className='img-thumb-wrap' + (i===currentImageIdx?' active':'');
    wrap.innerHTML = `<img src="${src}"><button class="rm" data-i="${i}">×</button>`;
    wrap.querySelector('img').addEventListener('click',()=>{ currentImageIdx=i; pinCurrentPage(); renderMainImage(); renderThumbs(); });
    imgThumbs.appendChild(wrap);
  });
  imgThumbs.querySelectorAll('.rm').forEach(b=>b.addEventListener('click', async (e)=>{
    e.stopPropagation();
    const i = Number(b.dataset.i);
    const im = images[i];
    if(im.storagePath){ try{ await supabase.storage.from(PHOTOS_BUCKET).remove([im.storagePath]); }catch(err){ console.warn(err); } }
    images.splice(i,1);
    if(currentImageIdx>=i) currentImageIdx = Math.max(0, currentImageIdx-1);
    renderThumbs(); renderMainImage(); await saveCurrentTeam();
  }));
}
function openLightbox(src){
  const root = document.getElementById('lightboxRoot');
  root.innerHTML = `<div class="lightbox"><img src="${src}"></div>`;
  root.querySelector('.lightbox').addEventListener('click',()=>root.innerHTML='');
}

async function uploadNewImagesToStorage(){
  if(!currentTeamNumber) return;
  for(const im of images){
    if(im.storagePath) continue; // already uploaded
    const path = `${division}/${currentTeamNumber}/${Date.now()}-${Math.random().toString(36).slice(2,7)}.jpg`;
    try{
      const blob = await (await fetch(im.dataUrl)).blob();
      const {error} = await supabase.storage.from(PHOTOS_BUCKET).upload(path, blob, {contentType:'image/jpeg'});
      if(error) throw error;
      const {data:{publicUrl}} = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path);
      im.storagePath = path; im.url = publicUrl;
      delete im.base64; delete im.dataUrl; // don't keep raw base64 in memory/DB once hosted
    }catch(err){ console.error('upload failed', err); }
  }
  renderThumbs();
  await saveCurrentTeam();
}

/* ---------- FINALIZE (delete photos, keep scores) ---------- */
document.getElementById('finalizeBtn').addEventListener('click', async ()=>{
  if(!currentTeamNumber) return;
  if(!confirm('Delete the uploaded photos for this team? Scores and the report will stay saved.')) return;
  const paths = images.filter(im=>im.storagePath).map(im=>im.storagePath);
  if(paths.length){ try{ await supabase.storage.from(PHOTOS_BUCKET).remove(paths); }catch(err){ console.warn(err); } }
  images = [];
  finalized = true;
  const rosterEntry = roster.find(r=>r.number===currentTeamNumber);
  if(rosterEntry) rosterEntry.finalized = true;
  await saveCurrentTeam();
  closeGradingView();
});

// Cancels any pending debounced save without flushing it — use this when the
// team's row is being deleted or was just explicitly saved (finalize), so we
// don't risk writing stale/unwanted data back. For switching away from a team
// or division with possibly-unsaved edits, call flushPendingSave() first instead.
function closeGradingView(){
  currentTeamNumber = null;
  clearTimeout(saveTimer); saveTimer = null; pendingSave = false;
  updateSaveStatus('');
  document.getElementById('gradingArea').style.display='none';
  renderRoster();
  updateUrl();
}

async function flushPendingSave(){
  if(saveTimer){
    clearTimeout(saveTimer); saveTimer = null;
    await saveCurrentTeam();
  }
}

window.addEventListener('beforeunload', (e)=>{
  if(pendingSave){ e.preventDefault(); e.returnValue = ''; }
});

/* ---------- SUPABASE: DIVISION / LEVEL / ROSTER ---------- */
const divisionToggle = document.getElementById('divisionToggle');
divisionToggle.addEventListener('click', async (e)=>{
  const btn = e.target.closest('button'); if(!btn) return;
  await selectDivision(btn.dataset.division);
});

async function selectDivision(div){
  await flushPendingSave();
  division = div;
  localStorage_safeSet('last-division', div);
  document.querySelectorAll('#divisionToggle button').forEach(b=>b.classList.toggle('active', b.dataset.division===div));
  document.getElementById('rosterHeading').textContent = 'Roster — Division ' + div;
  document.getElementById('tiebreakText').textContent = TIEBREAK[div];
  closeGradingView();
  currentSectionIdx = 0;
  renderSectionStepper(); updateTotals();
  await refreshRoster();
}

async function loadLevel(){
  const {data} = await supabase.from('event_settings').select('level').eq('id',1).maybeSingle();
  level = data?.level || 'regional';
  document.querySelectorAll('#levelToggle button').forEach(b=>b.classList.toggle('active', b.dataset.level===level));
}
async function saveLevel(){
  await supabase.from('event_settings').update({level}).eq('id',1);
}

async function refreshRoster(){
  const {data: teamRows, error} = await supabase.from('teams').select('number,name,final,finalized,scores').eq('division', division);
  if(error){ console.error(error); roster=[]; }
  else roster = teamRows || [];
  renderRoster();
}

function renderRoster(){
  const list = document.getElementById('rosterList');
  const empty = document.getElementById('rosterEmpty');
  list.innerHTML='';
  empty.style.display = roster.length ? 'none':'block';
  const visibleIds = visibleSections().flatMap(s=>s.items.filter(isVisible)).map(it=>it.id);
  roster.slice().sort((a,b)=> (a.number||'').localeCompare(b.number||'', undefined, {numeric:true})).forEach(t=>{
    const row = document.createElement('div');
    row.className = 'roster-row' + (t.number===currentTeamNumber?' active':'');
    const status = t.finalized ? 'Finalized' : (t.final!=null ? 'In progress' : 'Not started');
    const scoredCount = visibleIds.filter(id=>t.scores?.[id]!=null).length;
    row.innerHTML = `<span class="rnum mono">${escapeHtml(t.number)}</span><span class="rname">${escapeHtml(t.name||'')}</span><span class="rstatus">${status}</span><span class="rprogress mono">${scoredCount}/${visibleIds.length}</span><span class="rscore mono">${t.final!=null?t.final.toFixed(2):'— pts'}</span><button class="btn small ghost" data-num="${t.number}">Grade</button><button class="btn small danger" data-del="${t.number}">Delete</button>`;
    list.appendChild(row);
  });
  list.querySelectorAll('button[data-num]').forEach(b=>b.addEventListener('click',()=>selectTeamForGrading(b.dataset.num)));
  list.querySelectorAll('button[data-del]').forEach(b=>b.addEventListener('click',()=>deleteTeam(b.dataset.del)));
}

document.getElementById('addTeamBtn').addEventListener('click', async ()=>{
  const number = document.getElementById('addNumber').value.trim();
  const name = document.getElementById('addName').value.trim();
  if(!number) return;
  const existing = roster.find(r=>r.number===number);
  if(existing) existing.name = name || existing.name;
  else roster.push({number, name, final:null, finalized:false});
  await supabase.from('teams').upsert(
    {division, number, name: (existing?existing.name:name)},
    {onConflict:'division,number'}
  );
  document.getElementById('addNumber').value=''; document.getElementById('addName').value='';
  renderRoster();
  selectTeamForGrading(number);
});

async function deleteTeam(number){
  if(!confirm(`Delete team ${number} entirely? This removes its scores, report, and any uploaded photos. This cannot be undone.`)) return;
  if(currentTeamNumber===number){
    // Cancel (don't flush) any pending debounced save — we're about to delete
    // this row, so writing stale data back to it would just resurrect it.
    clearTimeout(saveTimer); saveTimer = null; pendingSave = false;
  }
  const {data: d} = await supabase.from('teams').select('images').eq('division', division).eq('number', number).maybeSingle();
  const paths = (d?.images||[]).filter(im=>im.storagePath).map(im=>im.storagePath);
  if(paths.length){ try{ await supabase.storage.from(PHOTOS_BUCKET).remove(paths); }catch(err){ console.warn(err); } }
  await supabase.from('teams').delete().eq('division', division).eq('number', number);
  roster = roster.filter(r=>r.number!==number);
  if(currentTeamNumber===number) closeGradingView();
  else renderRoster();
}

async function selectTeamForGrading(number){
  await flushPendingSave();
  currentTeamNumber = number;
  scores={}; images=[]; finalized=false; currentSectionIdx=0; currentImageIdx=0; sectionPageIndex={};
  updateSaveStatus('');
  document.getElementById('finalizedNote').style.display='none';
  dropZone.classList.remove('disabled');
  try{
    const {data: d} = await supabase.from('teams').select('*')
      .eq('division', division).eq('number', number).maybeSingle();
    if(d){
      scores = d.scores||{};
      finalized = !!d.finalized;
      images = (d.images||[]).map(im=>({mediaType:im.mediaType, url:im.url, storagePath:im.storagePath}));
      sectionPageIndex = d.section_pages || {};
      if(d.mult){
        document.getElementById('multMaterials').checked = !!d.mult.materials;
        document.getElementById('multFake').checked = !!d.mult.fake;
        document.getElementById('multOffTopic').value = d.mult.offTopic ?? 1;
        document.getElementById('offTopicVal').textContent = Number(document.getElementById('multOffTopic').value).toFixed(2);
      }
      if(finalized){ document.getElementById('finalizedNote').style.display='block'; dropZone.classList.add('disabled'); }
    } else {
      document.getElementById('multMaterials').checked=false;
      document.getElementById('multFake').checked=false;
      document.getElementById('multOffTopic').value=1;
      document.getElementById('offTopicVal').textContent='1.00';
    }
  }catch(e){ console.error(e); }
  renderRoster();
  document.getElementById('gradingArea').style.display='block';
  const firstSec = visibleSections()[0];
  const pinned = firstSec ? sectionPageIndex[firstSec.id] : null;
  currentImageIdx = (pinned!=null && pinned<images.length) ? pinned : 0;
  renderThumbs(); renderMainImage();
  renderSectionStepper(); updateTotals();
  updateUrl();
}

function queueSave(){
  if(!currentTeamNumber) return;
  pendingSave = true;
  updateSaveStatus('pending');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveCurrentTeam, 900);
}
async function saveCurrentTeam(){
  if(!currentTeamNumber) return;
  saveTimer = null;
  const rosterEntry = roster.find(r=>r.number===currentTeamNumber);
  const record = {
    division,
    number: currentTeamNumber,
    name: rosterEntry?.name || '',
    scores,
    finalized,
    final: rosterEntry?.final ?? null,
    images: images.map(im=>({mediaType:im.mediaType, url:im.url, storagePath:im.storagePath})),
    section_pages: sectionPageIndex,
    mult:{
      materials: document.getElementById('multMaterials').checked,
      fake: document.getElementById('multFake').checked,
      offTopic: document.getElementById('multOffTopic').value
    },
    updated_at: new Date().toISOString()
  };
  updateSaveStatus('saving');
  try{
    const {error} = await supabase.from('teams').upsert(record, {onConflict:'division,number'});
    if(error) throw error;
    pendingSave = false;
    updateSaveStatus('saved');
  }catch(e){
    console.error('save failed', e);
    updateSaveStatus('error');
    saveTimer = setTimeout(saveCurrentTeam, 4000); // retry with backoff
  }
}
function updateSaveStatus(state){
  const el = document.getElementById('saveStatus');
  if(!el) return;
  el.className = 'save-status';
  if(state==='pending' || state==='saving'){ el.textContent='Saving…'; }
  else if(state==='saved'){ el.textContent='Saved ✓'; el.classList.add('ok'); }
  else if(state==='error'){ el.textContent='⚠ Save failed — retrying'; el.classList.add('err'); }
  else{ el.textContent=''; }
}
function updateUrl(){
  const params = new URLSearchParams();
  params.set('division', division);
  if(currentTeamNumber) params.set('team', currentTeamNumber);
  history.replaceState(null, '', location.pathname + '?' + params.toString());
}
function updateRosterScoreDisplay(final){
  const t = roster.find(r=>r.number===currentTeamNumber);
  if(!t) return;
  t.final = final;
  t.finalized = finalized;
  t.scores = scores;
  renderRoster();
}

/* ---------- KEYBOARD SHORTCUTS ---------- */
document.addEventListener('keydown', (e)=>{
  const tag = (document.activeElement.tagName||'').toLowerCase();
  if(tag==='input' || tag==='textarea') return; // don't hijack typing in text fields
  if(document.getElementById('gradingArea').style.display==='none') return;

  if(e.key>='0' && e.key<='9'){
    const val = Number(e.key);
    const itemEl = document.activeElement.closest('.stepper-item') || root.querySelector('.stepper-item');
    if(itemEl){
      const btn = itemEl.querySelector(`.scale-btn[data-val="${val}"]`);
      if(btn){ btn.click(); e.preventDefault(); } // click handler re-focuses the item after re-render
    }
  } else if(e.key==='ArrowRight'){
    const btn = document.getElementById('nextSectionBtn');
    if(btn && !btn.disabled){ btn.click(); e.preventDefault(); }
  } else if(e.key==='ArrowLeft'){
    const btn = document.getElementById('prevSectionBtn');
    if(btn && !btn.disabled){ btn.click(); e.preventDefault(); }
  }
});

/* ---------- INIT ---------- */
(async function init(){
  document.querySelectorAll('#divisionToggle button').forEach(b=>b.classList.toggle('active', b.dataset.division===division));
  document.getElementById('rosterHeading').textContent = 'Roster — Division ' + division;
  document.getElementById('tiebreakText').textContent = TIEBREAK[division];
  renderSectionStepper(); updateTotals(); renderMainImage();
  await loadLevel();
  renderSectionStepper(); updateTotals();
  await refreshRoster();
  const urlTeam = urlParams.get('team');
  if(urlTeam && roster.some(r=>r.number===urlTeam)) await selectTeamForGrading(urlTeam);
  updateUrl();
})();
