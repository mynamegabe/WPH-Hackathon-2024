
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from utils.config import SENDGRID_API_KEY

def sendEmail(subject: str, template_id: str, from_email: str, to_email: str, dynamic_template_data: dict):

    message = Mail(
        from_email=from_email,
        to_emails=to_email,
        subject=subject
    )
    
    message.dynamic_template_data = dynamic_template_data
    
    message.template_id = template_id
    
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e)
        return False
    return True