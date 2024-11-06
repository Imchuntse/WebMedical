import warnings
import numpy as np
warnings.simplefilter(action='ignore', category=UserWarning)
import pandas as pd
import json
import pymssql

config = "testing"

if config == "testing1":
    conn = conn = pymssql.connect(server="DESKTOP-0MUAA95\BPSINSTANCE" , user="bpsrawdata", password="password", database="BPSSamples") 
    cursor = conn.cursor()
    
class PdEncoder(json.JSONEncoder):
    def default(self, obj):
        dtypes = (np.datetime64, np.complexfloating)
        if isinstance(obj, pd.Timestamp):
            return obj.strftime('%Y-%m-%d %X')
        return super(PdEncoder, self).default(obj)    
    
def read_from_database(query):
 
    a = internal_read_from_database(query)
    print(query)
    return json.dumps(a, cls=PdEncoder)

def internal_read_from_database(query):
    df = pd.read_sql(query, conn)
    df = df.map(lambda x: x.strip() if isinstance(x, str) else x)
    df = df.map(lambda x: x[:500] if isinstance(x, str) and len(x) > 75 else x)
    return  df.to_dict(orient='records')

def get_patients():
    return read_from_database('''SELECT INTERNALID
    ,[FIRSTNAME]
      ,[MIDDLENAME]
      ,[SURNAME]
      ,[PREFERREDNAME]       
      ,[ADDRESS1]
      ,[ADDRESS2]
      ,[CITY]
      ,[POSTCODE]
        ,[DOB]
        ,[HOMEPHONE]
      ,[WORKPHONE]
      ,[MOBILEPHONE]
        ,[MEDICARENO]
      
      FROM PATIENTS
      ''')
    
    
def get_GPs():
    return read_from_database('''
    SELECT [USERID]
    ,[SURNAME]
      ,[FIRSTNAME]      
      ,[EMAIL]      
      ,[APPOINTMENTS]
      FROM USERS''')
    
    
def get_Appointments():
    return read_from_database('''
    SELECT  app.[RECORDID]
      ,app.INTERNALID 
      ,PATIENTS.FIRSTNAME as PATIENTS_FIRSTNAME
	,PATIENTS.SURNAME as PATIENTS_SURNAME
      ,app.USERID
      ,USERS.FIRSTNAME as users_firstname
      ,USERs.SURNAME as users_SURNAME
      ,app.[APPOINTMENTDATE]
      ,app.[APPOINTMENTTIME]
      ,app.[APPOINTMENTLENGTH]
      ,code.DESCRIPTION as app_code
      ,typ.[DESCRIPTION] as app_type
      ,app.[REASON]   
      ,app.[ARRIVALTIME]
      ,app.[CONSULTATIONTIME]
      ,app.[ROOMID]
      ,app.[CREATED]
      ,app.[CREATEDBY]
      ,app.[BOOKEDBY]
      ,app.[URGENT]      
      ,app.[ITEMLIST]
      ,app.[COMMENT]
      FROM Appointments as app
	  join PATIENTS on app.INTERNALID = PATIENTS.INTERNALID
	  join USERS on app.USERID = USERS.USERID
        join APPOINTMENTTYPES as typ on app.APPOINTMENTTYPE = typ.APPOINTMENTCODE
	  join APPOINTMENTCODES as code on app.APPOINTMENTCODE = code.APPOINTMENTCODE
      ''')
    
    
def get_patients_visit():
    return read_from_database('''
SELECT   visit.[VISITID]
      ,visit.INTERNALID
      ,PATIENTS.FIRSTNAME as PATIENTS_FIRSTNAME
	,PATIENTS.SURNAME as PATIENTS_SURNAME
      ,visit.USERID
      ,USERS.FIRSTNAME as users_firstname
	  ,USERs.SURNAME as users_SURNAME
      ,visit.[RECORDSTATUS]
      ,typ.VISITTYPE
      ,visit.[DRNAME]
      ,visit.[VISITDATE]
      ,visit.[DURATION]
      ,visit.[VISITNOTES]
	,reason.REASON
  FROM VISITS as visit
  	  join USERS on visit.USERID = USERS.USERID
join PATIENTS on visit.INTERNALID = PATIENTS.INTERNALID
  join VISITTYPE as typ on visit.VISITCODE = typ.VISITCODE
  join VISITREASON as reason on visit.VISITID = reason.VISITID
      
      ''')
    
    
'''
STATUSCODE == 2, means inactive problem
STATUSCODE == 1, means active problem
'''
def get_patients_medication_history():
    
    return read_from_database('''
SELECT ph.[RECORDID]
      ,ph.[RECORDSTATUS]
      ,ph.INTERNALID
      ,PATIENTS.FIRSTNAME as PATIENTS_FIRSTNAME
	,PATIENTS.SURNAME as PATIENTS_SURNAME
      ,ph.[YEAR]
      ,ph.[MONTH]
      ,ph.[DAY]
      ,ph.[ITEMTEXT]
      ,ph.[ITEMCODE]
      ,ph.[STATUSCODE]
      ,ph.[DETAILS]
  FROM  [PASTHISTORY] as ph
  join PATIENTS on ph.INTERNALID = PATIENTS.INTERNALID
      ''', conn)
    
    
    
    
    
def patient_search_with_id(id):
    return read_from_database('''SELECT INTERNALID as id
    ,[firstname]
      ,[middlename]
      ,[surname]
      from patients
      where internalid = ''' + id)

def patient_search_with_name(name):
    return read_from_database(r'''SELECT INTERNALID as id , [firstname], [middlename], [surname] from patients where LOWER(CONCAT( firstname , MIDDLENAME , surname)) LIKE '%''' + name + "%'")
        # return a
    
def patient_search_with_dob(dob):
    return read_from_database('''SELECT INTERNALID as id , [firstname], [middlename], [surname] from patients where patients.dob like  \'''' + dob + "'%") 
    
    
    
    
def gp_search_with_id(id):
    return read_from_database('''SELECT [USERID] as id
    ,[firstname]
      ,[surname]
      from USERS
      where USERID = ''' + id)

def gp_search_with_name(name):
    return read_from_database(r'''SELECT [USERID] as id , [firstname], [surname] from USERS where LOWER(CONCAT( firstname , surname)) LIKE '%''' + name + "%'")
        # return a

def search_appoitment_by_patient_id(input_id, start_date, end_date):
    return read_from_database(f'''
    SELECT  app.[RECORDID]
        ,app.INTERNALID 
        ,PATIENTS.FIRSTNAME as PATIENTS_FIRSTNAME
        ,PATIENTS.SURNAME as PATIENTS_SURNAME
        ,app.USERID
        ,USERS.FIRSTNAME as users_firstname
        ,USERs.SURNAME as users_SURNAME
        ,app.[APPOINTMENTDATE]
        ,app.[APPOINTMENTTIME]
        ,app.[APPOINTMENTLENGTH]
        ,code.DESCRIPTION as app_code
        ,typ.[DESCRIPTION] as app_type
        ,app.[REASON]   
        ,app.[ARRIVALTIME]
        ,app.[CONSULTATIONTIME]
        ,app.[ROOMID]
        ,app.[CREATED]
        ,app.[CREATEDBY]
        ,app.[BOOKEDBY]
        ,app.[URGENT]      
        ,app.[ITEMLIST]
        ,app.[COMMENT]
        FROM Appointments as app
        join PATIENTS on app.INTERNALID = PATIENTS.INTERNALID
        join USERS on app.USERID = USERS.USERID
        join APPOINTMENTTYPES as typ on app.APPOINTMENTTYPE = typ.APPOINTMENTCODE
        join APPOINTMENTCODES as code on app.APPOINTMENTCODE = code.APPOINTMENTCODE
        where app.INTERNALID = {input_id} and app.APPOINTMENTDATE >= '{start_date}' and app.APPOINTMENTDATE <= '{end_date}'
    ''')

def search_appoitment_by_gp_id(input_id, start_date, end_date):
    return read_from_database(f'''
    SELECT  app.[RECORDID]
        ,app.INTERNALID 
        ,PATIENTS.FIRSTNAME as PATIENTS_FIRSTNAME
        ,PATIENTS.SURNAME as PATIENTS_SURNAME
        ,app.USERID
        ,USERS.FIRSTNAME as users_firstname
        ,USERs.SURNAME as users_SURNAME
        ,app.[APPOINTMENTDATE]
        ,app.[APPOINTMENTTIME]
        ,app.[APPOINTMENTLENGTH]
        ,code.DESCRIPTION as app_code
        ,typ.[DESCRIPTION] as app_type
        ,app.[REASON]   
        ,app.[ARRIVALTIME]
        ,app.[CONSULTATIONTIME]
        ,app.[ROOMID]
        ,app.[CREATED]
        ,app.[CREATEDBY]
        ,app.[BOOKEDBY]
        ,app.[URGENT]      
        ,app.[ITEMLIST]
        ,app.[COMMENT]
        FROM Appointments as app
        join PATIENTS on app.INTERNALID = PATIENTS.INTERNALID
        join USERS on app.USERID = USERS.USERID
        join APPOINTMENTTYPES as typ on app.APPOINTMENTTYPE = typ.APPOINTMENTCODE
        join APPOINTMENTCODES as code on app.APPOINTMENTCODE = code.APPOINTMENTCODE
        where app.USERID = {input_id} and app.APPOINTMENTDATE >= '{start_date}' and app.APPOINTMENTDATE <= '{end_date}'
    ''')

def search_appoitment_by_date(start_date, end_date):
    return read_from_database(f'''
    SELECT  app.[RECORDID]
        ,app.INTERNALID 
        ,PATIENTS.FIRSTNAME as PATIENTS_FIRSTNAME
        ,PATIENTS.SURNAME as PATIENTS_SURNAME
        ,app.USERID
        ,USERS.FIRSTNAME as users_firstname
        ,USERs.SURNAME as users_SURNAME
        ,app.[APPOINTMENTDATE]
        ,app.[APPOINTMENTTIME]
        ,app.[APPOINTMENTLENGTH]
        ,code.DESCRIPTION as app_code
        ,typ.[DESCRIPTION] as app_type
        ,app.[REASON]   
        ,app.[ARRIVALTIME]
        ,app.[CONSULTATIONTIME]
        ,app.[ROOMID]
        ,app.[CREATED]
        ,app.[CREATEDBY]
        ,app.[BOOKEDBY]
        ,app.[URGENT]      
        ,app.[ITEMLIST]
        ,app.[COMMENT]
        FROM Appointments as app
        join PATIENTS on app.INTERNALID = PATIENTS.INTERNALID
        join USERS on app.USERID = USERS.USERID
        join APPOINTMENTTYPES as typ on app.APPOINTMENTTYPE = typ.APPOINTMENTCODE
        join APPOINTMENTCODES as code on app.APPOINTMENTCODE = code.APPOINTMENTCODE
        where app.APPOINTMENTDATE >= '{start_date}' and app.APPOINTMENTDATE <= '{end_date}'
    ''')

def search_appoitment_by_app_id(input_id):
    return read_from_database(f'''
    SELECT  app.[RECORDID]
        ,app.INTERNALID 
        ,PATIENTS.FIRSTNAME as PATIENTS_FIRSTNAME
        ,PATIENTS.SURNAME as PATIENTS_SURNAME
        ,app.USERID
        ,USERS.FIRSTNAME as users_firstname
        ,USERs.SURNAME as users_SURNAME
        ,app.[APPOINTMENTDATE]
        ,app.[APPOINTMENTTIME]
        ,app.[APPOINTMENTLENGTH]
        ,code.DESCRIPTION as app_code
        ,typ.[DESCRIPTION] as app_type
        ,app.[REASON]   
        ,app.[ARRIVALTIME]
        ,app.[CONSULTATIONTIME]
        ,app.[ROOMID]
        ,app.[CREATED]
        ,app.[CREATEDBY]
        ,app.[BOOKEDBY]
        ,app.[URGENT]      
        ,app.[ITEMLIST]
        ,app.[COMMENT]
        FROM Appointments as app
        join PATIENTS on app.INTERNALID = PATIENTS.INTERNALID
        join USERS on app.USERID = USERS.USERID
        join APPOINTMENTTYPES as typ on app.APPOINTMENTTYPE = typ.APPOINTMENTCODE
        join APPOINTMENTCODES as code on app.APPOINTMENTCODE = code.APPOINTMENTCODE
        where app.[RECORDID] = {input_id}  
    ''')
    
    
def get_all_gp_ids():
    return internal_read_from_database('''
    SELECT [USERID]
      FROM USERS''')
    
def get_statistics_for_all_gp(start_date, end_date):
    return read_from_database(f'''
    SELECT COUNT(app.[RECORDID]) as number_appointments , Sum(app.APPOINTMENTLENGTH) / 60 as expected_workload, app.USERID as gp_id
    FROM Appointments as app
    WHERE app.APPOINTMENTDATE >= '{start_date}' and app.APPOINTMENTDATE <= '{end_date}'
    GROUP BY app.USERID
    ''')

def get_statistics_for_one_gp(gp_id, start_date, end_date):
    return internal_read_from_database(f'''
    SELECT COUNT(app.[RECORDID]) as number_appointments , Sum(app.APPOINTMENTLENGTH) / 60 as expected_workload 
    FROM Appointments as app
    where app.USERID = {gp_id} and app.APPOINTMENTDATE >= '{start_date}' and app.APPOINTMENTDATE <= '{end_date}'
    ''')
    
def if_visit_prior_12_month(input_id, start_date, start_date_minus_12_month):
    return read_from_database(f'''
    SELECT *
    FROM VISITS as visit
    where visit.INTERNALID = {input_id} and visit.VISITDATE >= '{start_date_minus_12_month}' and visit.VISITDATE <= '{start_date}'
    ''')
    
    
def if_medicare(id):
    return read_from_database(f'''
    SELECT *
    FROM PATIENTS as patient
    where patient.INTERNALID = {id} and patient.MEDICARENO is not null
    ''')