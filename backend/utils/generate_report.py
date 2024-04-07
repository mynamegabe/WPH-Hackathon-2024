# from reportlab.pdfgen.canvas import Canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

import json
from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Paragraph, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm, inch
PAGESIZE = (140 * mm, 216 * mm)
BASE_MARGIN = 5 * mm

pdfmetrics.registerFont(
    TTFont('LexendDeca', 'utils/LexendDeca-VariableFont_wght.ttf'))


class PdfCreator:
    sample_style_sheet = getSampleStyleSheet()

    def add_page_number(self, canvas, doc):
        canvas.saveState()
        canvas.setFont('Times-Roman', 10)
        page_number_text = "%d" % (doc.page)
        canvas.drawCentredString(
            0.75 * inch,
            0.75 * inch,
            page_number_text
        )
        canvas.restoreState()

    def get_body_style(self):
        sample_style_sheet = getSampleStyleSheet()
        body_style = sample_style_sheet['BodyText']
        body_style.fontName = 'LexendDeca'
        return body_style

    def get_heading1_style(self):
        sample_style_sheet = getSampleStyleSheet()
        h1_style = sample_style_sheet['Heading1']
        h1_style.fontName = 'LexendDeca'
        return h1_style
    
    def get_heading2_style(self):
        sample_style_sheet = getSampleStyleSheet()
        h2_style = sample_style_sheet['Heading2']
        h2_style.fontName = 'LexendDeca'
        return h2_style
    
    def get_heading3_style(self):
        sample_style_sheet = getSampleStyleSheet()
        h3_style = sample_style_sheet['Heading3']
        h3_style.fontName = 'LexendDeca'
        return h3_style
    
    def get_heading4_style(self):
        sample_style_sheet = getSampleStyleSheet()
        h4_style = sample_style_sheet['Heading4']
        h4_style.fontName = 'LexendDeca'
        return h4_style
    
    def build_pdf(self, image, name, description, traits, age, phone_number, email, forms):
        pdf_buffer = BytesIO()
        my_doc = SimpleDocTemplate(
            pdf_buffer,
            pagesize=PAGESIZE,
            topMargin=BASE_MARGIN,
            leftMargin=BASE_MARGIN,
            rightMargin=BASE_MARGIN,
            bottomMargin=BASE_MARGIN
        )
        body_style = self.get_body_style()
        heading1_style = self.get_heading1_style()
        heading2_style = self.get_heading2_style()
        heading3_style = self.get_heading3_style()
        heading4_style = self.get_heading4_style()
        flowables = [
            Paragraph("Report", heading1_style),
            Image(image, width=72, height=72),
            Paragraph(name, heading2_style),
            Paragraph(
                description,
                body_style
            ),
            Paragraph("Traits", heading2_style),
            Paragraph(traits, body_style),

            Paragraph("Personal Information", heading2_style),
            Paragraph(f"Age: {age}", body_style),
            Paragraph(f"Phone Number: {phone_number}", body_style),
            Paragraph(f"Email: {email}", body_style),
            
            PageBreak(),
        ]
        for form in forms:
            flowables.append(Paragraph(form, heading2_style))
            for response in forms[form]:
                flowables.append(Paragraph(response["question"], heading3_style))
                try:
                    # decode json
                    resp = json.loads(response["response"])
                    for q in resp:
                        flowables.append(Paragraph(f"{q['question']}", heading4_style))
                        flowables.append(Paragraph(f"{q['reply']}", body_style))
                    continue
                except Exception as e:
                    print(e)
                    flowables.append(Paragraph(response["response"], body_style))
                
        my_doc.build(
            flowables,
            onFirstPage=self.add_page_number,
            onLaterPages=self.add_page_number,
        )
        pdf_value = pdf_buffer.getvalue()
        pdf_buffer.close()
        return pdf_value


if __name__ == "__main__":
    pdf_creator = PdfCreator()
    pdf_value = pdf_creator.build_pdf(
        image="../uploads/avatars/0.png",
        name="John Doe",
        description="John Doe is a software engineer with 5 years of experience. He is proficient in Python, Java, and C++. He is also a team player and a quick learner.",
        traits="Python, Java, C++",
        age=21,
        phone_number="1234567890",
        email="johndoe@gmail.com"
    )
    with open("output.pdf", "wb") as pdf_file:
        pdf_file.write(pdf_value)
