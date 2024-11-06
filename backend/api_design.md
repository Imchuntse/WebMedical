| Endpoint | paramters |  returns  |
| ------------- | ------------- |------------- |
| search_patient |  string(name, dob or id)  | <code>[{<br>first_name: "",<br> middle_name: "",<br> surname:"",<br> id: "" <br> }] <code> |
| search_gp |  string(name, dob ( mm/dd/yyyy or mm-dd-yyyy or mm.dd.yyyy) or id)  | <code>[{first_name: "",<br> middle_name: "",<br> surname:"",<br> id: "" <br>  }]<code>  |
| search_appoitment_by_patient_id|patient_id , start_date (2020-07-30), end_date  |  |
| search_appoitment_by_gp_id| gp_id, start_date (2020-07-30), end_date  |  |
| search_appoitment_by_app_id| app_id |  |
| add_note| appoitment_id, string |  |
| update_note| appoitment_id, string, note_id ||
| delete_note| note_id ||
| view_note | appoitment_id ||
| clear_all_note||
| number_appointments_and_expected_workload | start_date (2020-07-30), end_date, gp_id (-1 for all gp),  | {"gp_id": gp_id, "number_appointments" : number_appointments, "expected_workload" : expected_workload in mins} |
