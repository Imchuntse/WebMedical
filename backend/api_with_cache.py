from apiflask import APIBlueprint
from flask_cors import CORS, cross_origin
import json
from dateutil.parser import parse as parse_datetime
import datetime
import re
from apiflask import APIFlask, Schema, abort, fields
from apiflask.fields import Integer, String
from tinydb import TinyDB, Query
from dateutil.relativedelta import relativedelta

databse_tiny = "./model/database_tiny/"
databse_full_sample = "./model/database_full_sample/"
database_only_important_sample_json = "./model/database_only_important_sample_json/"

blueprint = APIBlueprint('test_api', __name__, url_prefix='/test')
Table_name = ["Patients", "Appointments", "Gps_info", "Patients_visits", "Patients_medication_history"]
data = {}

note_db = TinyDB("./model/note_database/note.json")
User = Query()

nouse_gp_id = [2000000000, 2000000003, 2000000512]
for i in Table_name:
    f = TinyDB(databse_tiny + i + ".json")
    data[i] = f
    



@blueprint.route('/get_patients')
def get_patients():
    return data["Patients"].all()

@blueprint.route('/get_appoinments')
def api_get_appoinments():
    return data["Appointments"].all()

@blueprint.route('/get_GPs')
def api_get_GPs():
    return data["Gps_info"].all()

@blueprint.route('/get_patients_visit')
def api_get_patients_visit():
    return data["Patients_visits"].all()


@blueprint.route('/get_patients_medication_history')
def api_get_patients_medication_history():
    return data["Patients_medication_history"].all()


class SearchIn(Schema):
    input = String(required=True)    

@blueprint.get("/search_patient")
@blueprint.input(SearchIn, location='query') 
def api_search_patient(query_data):
    input = query_data["input"]
    if re.search("^\s*[0-9]+\s*$", input):
        # id
        print("paser to id" , input.strip())
        return data["Patients"].search(User.INTERNALID == int(input.strip()))
    else:
        date = None
        try:
            date = parse_datetime(input, dayfirst=True)
        except :
            print("Error in parse_datetime")
        
        if date:
            # dob
            print("paser to datetime" , date)
            
            return data["Patients"].search( datetime.datetime.fromtimestamp(User.DOB).date == date )

        else:
            # name
            print("paser to name" ,input)
            input = input.lower().strip()
            for i in data["Patients"]:
                res1 = data["Patients"].search( User.FIRSTNAME.matches(f"^{input}.*$", flags=re.IGNORECASE) )
                res2 = data["Patients"].search( User.SURNAME.matches(f"^{input}.*$", flags=re.IGNORECASE)   )

                return res1+ res2
    return []

@blueprint.get("/search_gp")
@blueprint.input(SearchIn, location='query') 
def api_search_gp(query_data):
    input = query_data["input"]
    if re.search("^\s*[0-9]+\s*$", input):
        # id
        print("paser to id" , input.strip())
        return data["Gps_info"].search(User.USERID == int(input.strip()))
    else:
        print("paser to name" ,input)
        input = input.lower().strip()
        for i in data["Gps_info"]:
            res1 = data["Gps_info"].search( User.FIRSTNAME.matches(f"^{input}.*$", flags=re.IGNORECASE) )
            res2 = data["Gps_info"].search( User.SURNAME.matches(f"^{input}.*$", flags=re.IGNORECASE)   )

            return res1+ res2
    return []
    

class SearchAppIn(Schema):
    input_id = Integer(required=True)
    start_date = fields.Date(required=True) 
    end_date = fields.Date(required=True) 

@blueprint.get("/search_appoitment_by_patient_id")
@blueprint.input(SearchAppIn, location='query')  
def api_search_appoitment_by_patient_id(query_data):
    input_id = query_data["input_id"]
    start_date = int((query_data["start_date"]  - datetime.date(1970, 1, 1)).total_seconds() * 1000 )
    end_date = int((query_data["end_date"]  - datetime.date(1970, 1, 1)).total_seconds() * 1000)
    return data["Appointments"].search((User.INTERNALID == input_id) & (User.APPOINTMENTDATE >= start_date) & (User.APPOINTMENTDATE <= end_date) )



@blueprint.get("/search_appoitment_by_gp_id")
@blueprint.input(SearchAppIn, location='query')  
def api_search_appoitment_by_gp_id(query_data):
    input_id = query_data["input_id"]
    start_date = int((query_data["start_date"]  - datetime.date(1970, 1, 1)).total_seconds() * 1000 )
    end_date = int((query_data["end_date"]  - datetime.date(1970, 1, 1)).total_seconds() * 1000)
    return data["Appointments"].search((User.USERID == input_id ) & (User.APPOINTMENTDATE >= start_date) & (User.APPOINTMENTDATE <= end_date) )

class SearchAppByAppIn(Schema):
    input_id = Integer(required=True)
 
@blueprint.get("/search_appoitment_by_app_id")
@blueprint.input(SearchAppByAppIn, location='query')  
def api_search_appoitment_by_app_id(query_data):
    input_id = query_data["input_id"]
    return data["Appointments"].search(User.RECORDID == input_id)

class SearchAppDateIn(Schema):
    start_date = fields.Date(required=True) 
    end_date = fields.Date(required=True) 

@blueprint.get("/search_appoitment_by_date")
@blueprint.input(SearchAppDateIn, location='query')  
def api_search_appoitment_by_date(query_data):
    start_date = int((query_data["start_date"]  - datetime.date(1970, 1, 1)).total_seconds() * 1000 )
    end_date = int((query_data["end_date"]  - datetime.date(1970, 1, 1)).total_seconds() * 1000)
    return data["Appointments"].search((User.APPOINTMENTDATE >= start_date) & (User.APPOINTMENTDATE <= end_date) )

class NoteIn(Schema):
    id = Integer(required=True)  
    data_string = String(required=True)  

@blueprint.get("/add_note")
@blueprint.input(NoteIn, location='query')  
def api_add_note(query_data):
    id = query_data["id"]
    data_string = query_data["data_string"]
    if note_db.insert({"app_id": id, "note" : data_string}):
        return "success"
    else:
        return "fail"

class NoteUpdateIn(Schema):
    id = Integer(required=True)  
    data_string = String(required=True)  
    note_id = Integer(required=True) 
    
@blueprint.get("/update_note")
@blueprint.input(NoteUpdateIn, location='query')  
def api_update_note(query_data):
    id = query_data["id"]
    data_string = query_data["data_string"]
    note_id = query_data["note_id"]
    if note_db.update({"app_id": id, "note" : data_string}, doc_ids=[note_id] ):
        return "success"
    else:
        return "fail"
    
class NoteDeleteIn(Schema):
    id = Integer(required=True)  

@blueprint.get("/delete_note")
@blueprint.input(NoteDeleteIn, location='query')  
def api_delete_note(query_data):
    id = query_data["id"]
    if note_db.remove(doc_ids=[id]):
        return "success"
    else:
        return "fail"
    
@blueprint.get("/view_note")
@blueprint.input(NoteDeleteIn, location='query')  
def api_view_note(query_data):
    id = query_data["id"]
    return_res = []
    search_res = note_db.search(User.app_id == id)
    
    return [ {"note_id": i.doc_id, "app_id": i["app_id"], "note": i["note"]} for i in search_res]
    #     return note_db.search(User.app_id == id)
    # else:
    #     return []

@blueprint.get("/clear_all_note")
def api_clear_all_note():
    if note_db.remove(User.app_id != -1):
        return "success"
    else:
        return "fail"
    
    
class WorkLoadIn(Schema):
    start_date = fields.Date(required=True) 
    end_date = fields.Date(required=True) 
    gp_id = Integer(required=True)
    
@blueprint.get("/number_appointments_and_expected_workload")
@blueprint.input(WorkLoadIn, location='query')  
def api_number_appointments_and_expected_workload(query_data):
    gp_id = query_data["gp_id"]
    start_date = int((query_data["start_date"]  - datetime.date(1970, 1, 1)).total_seconds() * 1000 )
    end_date = int((query_data["end_date"]  - datetime.date(1970, 1, 1)).total_seconds() * 1000)
    res = []
    if gp_id == -1:
        all_gp_id = data["Gps_info"].all() 
        all_gp_id = [i["USERID"] for i in all_gp_id if i["USERID"]  not in nouse_gp_id]
        for current_gp_id in all_gp_id:
            
            match_app = data["Appointments"].search((User.APPOINTMENTDATE >= start_date) & (User.APPOINTMENTDATE <= end_date) & (User.USERID == current_gp_id))
            number_appointments = len(match_app) 
            expected_workload = 0
            for i in match_app:
                expected_workload += i["APPOINTMENTLENGTH"] / 60
            res.append({"gp_id": current_gp_id,"number_appointments" : number_appointments, "expected_workload" : expected_workload})
    else:
        match_app = data["Appointments"].search((User.APPOINTMENTDATE >= start_date) & (User.APPOINTMENTDATE <= end_date) & (User.USERID == gp_id))
        number_appointments = len(match_app) 
        expected_workload = 0
        for i in match_app:
            expected_workload += i["APPOINTMENTLENGTH"] / 60
        res.append({"gp_id": gp_id, "number_appointments" : number_appointments, "expected_workload" : expected_workload})
        
    return res


class SearchVisitIn(Schema):
    input_id = Integer(required=True)
    start_date = fields.Date(required=True) 

@blueprint.get("/if_visit_prior_12_month")
@blueprint.input(SearchVisitIn, location='query')  
def api_if_visit_prior_12_month(query_data):
    input_id = query_data["input_id"]
    start_date = int((query_data["start_date"]  - datetime.date(1970, 1, 1)).total_seconds() * 1000 )
    start_date_minus_12_month = int(((query_data["start_date"] - relativedelta(months=12))  - datetime.date(1970, 1, 1)).total_seconds() * 1000 )
    if data["Patients_visits"].search((User.INTERNALID == input_id ) & (User.VISITDATE >= start_date_minus_12_month) & (User.VISITDATE <= start_date) ):
        return "True"
    else:
        return "False"


@blueprint.get("/if_medicare")
@blueprint.input(NoteDeleteIn, location='query')  
def api_if_medicare(query_data):
    id = query_data["id"]
    res = data["Patients"].search(User.INTERNALID == id)
    if res and res[0]["MEDICARENO"] :
        return "True"
    else:
        return "False"