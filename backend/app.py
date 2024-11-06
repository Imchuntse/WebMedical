from apiflask import APIFlask, Schema, abort
from apiflask.fields import Integer, String, Date
from apiflask.validators import Length, OneOf
from flask_cors import CORS, cross_origin
from tinydb import Query, TinyDB
from api_with_cache import blueprint as basic_endpoints
import database_query 
import re
import json
import datetime
from dateutil.parser import parse as parse_datetime
from dateutil.relativedelta import relativedelta

app = APIFlask(__name__)
CORS(app, resources={r'/*': {'origins': '*'}})

note_db = TinyDB("./model/note_database/note.json")
User = Query()
nouse_gp_id = [2000000000, 2000000003, 2000000512]

app.register_blueprint(basic_endpoints)

@app.route("/get_appoinments", methods=['GET'])
def api_get_appoinments():
    return database_query.get_Appointments()

@app.route("/get_patients", methods=['GET'])
def api_get_patients():
    return database_query.get_patients()

@app.route("/get_GPs", methods=['GET'])
def api_get_GPs():
    return database_query.get_GPs()

@app.route("/get_patients_visit", methods=['GET'])
def api_get_patients_visit():
    return database_query.get_patients_visit()

@app.route("/get_patients_medication_history", methods=['GET'])
def get_patients_medication_history():
    return database_query.get_patients_medication_history()

class SearchIn(Schema):
    input = String(required=True)
    
@app.get("/search_patient")
@app.input(SearchIn, location='query') 
def api_search_patient(query_data):
    input = query_data["input"]
    if re.search("^\s*[0-9]+\s*$", input):
        # id
        print("paser to id" , input.strip())
        return database_query.patient_search_with_id(input)
    else:
        date = None
        try:
            date = parse_datetime(input, dayfirst=True)
        except :
            print("Error in parse_datetime")
        
        if date:
            # dob
            print("paser to datetime" , date)
            # search with
            # datetime.datetime.fromtimestamp(your_timestamp / 1e3)
            return database_query.patient_search_with_dob(date.strftime("%Y-%m-%d"))
        else:
            # name
            print("paser to name" ,input)
            return database_query.patient_search_with_name(input)


@app.get("/search_gp")
@app.input(SearchIn, location='query') 
def api_search_gp(query_data):
    input = query_data["input"]
    if re.search("^\s*[0-9]+\s*$", input):
        # id
        print("paser to id" , input.strip())
        return database_query.gp_search_with_id(input)
    else:
        print("paser to name" ,input)
        return database_query.gp_search_with_name(input)


# region search app
class SearchAppIn(Schema):
    input_id = Integer(required=True)
    start_date =  Date(required=True) 
    end_date = Date(required=True) 

@app.get("/search_appoitment_by_patient_id")
@app.input(SearchAppIn, location='query')  
def api_search_appoitment_by_patient_id(query_data):
    input_id = query_data["input_id"]
    start_date = query_data["start_date"].strftime("%Y-%m-%d")
    end_date = query_data["end_date"].strftime("%Y-%m-%d")
    return database_query.search_appoitment_by_patient_id(input_id, start_date, end_date)



@app.get("/search_appoitment_by_gp_id")
@app.input(SearchAppIn, location='query')  
def api_search_appoitment_by_gp_id(query_data):
    input_id = query_data["input_id"]
    start_date = query_data["start_date"].strftime("%Y-%m-%d")
    end_date = query_data["end_date"].strftime("%Y-%m-%d")
    return database_query.search_appoitment_by_gp_id(input_id, start_date, end_date)
    # return data["Appointments"].search(User.USERID == input_id and User.APPOINTMENTDATE >= start_date and User.APPOINTMENTDATE <= end_date)


class SearchAppByAppIn(Schema):
    input_id = Integer(required=True)
 
@app.get("/search_appoitment_by_app_id")
@app.input(SearchAppByAppIn, location='query')  
def api_search_appoitment_by_app_id(query_data):
    input_id = query_data["input_id"]
    return database_query.search_appoitment_by_app_id(input_id)
    # return data["Appointments"].search(User.RECORDID == input_id)

class SearchAppDateIn(Schema):
    start_date = Date(required=True) 
    end_date = Date(required=True) 

@app.get("/search_appoitment_by_date")
@app.input(SearchAppDateIn, location='query')  
def api_search_appoitment_by_date(query_data):
    start_date = query_data["start_date"].strftime("%Y-%m-%d")
    end_date = query_data["end_date"].strftime("%Y-%m-%d")
    return database_query.search_appoitment_by_date(start_date, end_date)
# endregion


# region Note

class NoteIn(Schema):
    id = Integer(required=True)  
    data_string = String(required=True)  

@app.get("/add_note")
@app.input(NoteIn, location='query')  
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
    
@app.get("/update_note")
@app.input(NoteUpdateIn, location='query')  
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

@app.get("/delete_note")
@app.input(NoteDeleteIn, location='query')  
def api_delete_note(query_data):
    id = query_data["id"]
    if note_db.remove(doc_ids=[id]):
        return "success"
    else:
        return "fail"
    
@app.get("/view_note")
@app.input(NoteDeleteIn, location='query')  
def api_view_note(query_data):
    id = query_data["id"]
    return_res = []
    search_res = note_db.search(User.app_id == id)
    return [ {"note_id": i.doc_id, "app_id": i["app_id"], "note": i["note"]} for i in search_res]

@app.get("/clear_all_note")
def api_clear_all_note():
    if note_db.remove(User.app_id != -1):
        return "success"
    else:
        return "fail"
    
# endregion


class WorkLoadIn(Schema):
    start_date = Date(required=True) 
    end_date = Date(required=True) 
    gp_id = Integer(required=True)
    
@app.get("/number_appointments_and_expected_workload")
@app.input(WorkLoadIn, location='query')  
def api_number_appointments_and_expected_workload(query_data):
    gp_id = query_data["gp_id"]
    start_date = query_data["start_date"].strftime("%Y-%m-%d")
    end_date = query_data["end_date"].strftime("%Y-%m-%d")

    if gp_id == -1:
        return database_query.get_statistics_for_all_gp(start_date, end_date)
    else:
        res = database_query.get_statistics_for_one_gp(gp_id, start_date, end_date)
        res[0]["gp_id"] = gp_id
        return json.dumps(res)

class SearchVisitIn(Schema):
    input_id = Integer(required=True)
    start_date = Date(required=True) 

@app.get("/if_visit_prior_12_month")
@app.input(SearchVisitIn, location='query')  
def api_if_visit_prior_12_month(query_data):
    input_id = query_data["input_id"]
    start_date = query_data["start_date"]
    start_date_minus_12_month = start_date- relativedelta(months=12)
    if database_query.if_visit_prior_12_month(input_id, start_date, start_date_minus_12_month):
        return "True"
    else:
        return "False"
    
@app.get("/if_medicare")
@app.input(NoteDeleteIn, location='query')  
def api_if_medicare(query_data):
    id = query_data["id"]
    if database_query.if_medicare(id):
        return "True"
    else:
        return "False"
    
if __name__ == "__main__":
    app.run(port=5000)