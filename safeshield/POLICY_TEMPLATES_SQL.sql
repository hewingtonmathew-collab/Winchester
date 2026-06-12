-- ── Policy Template Library ───────────────────────────────────────────────────
-- Run this in Supabase SQL editor after POLICY_ANALYZER_SQL.sql

CREATE TABLE IF NOT EXISTS policy_templates (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text        NOT NULL,
  policy_type   text        NOT NULL,
  description   text,
  content       text        NOT NULL,  -- markdown with {{PLACEHOLDER}} vars
  is_active     boolean     NOT NULL DEFAULT true,
  is_featured   boolean     NOT NULL DEFAULT false,
  sort_order    integer     NOT NULL DEFAULT 0,
  created_by    uuid        REFERENCES auth.users ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE policy_templates ENABLE ROW LEVEL SECURITY;

-- Super admin: full CRUD
CREATE POLICY "policy_templates_admin_all" ON policy_templates
  FOR ALL TO authenticated
  USING   (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- All authenticated: read active templates
CREATE POLICY "policy_templates_read_active" ON policy_templates
  FOR SELECT TO authenticated
  USING (is_active = true);


-- ── Seed templates ────────────────────────────────────────────────────────────

INSERT INTO policy_templates (title, policy_type, description, is_featured, sort_order, content) VALUES

('Data Protection Policy', 'data_protection',
 'Covers UK GDPR, DPA 2018, Data (Use and Access) Act 2025, ICO guidance, and the new s.164A complaints right in force June 2026.',
 true, 1,
$$# Data Protection Policy

**School:** {{SCHOOL_NAME}}
**School Type:** {{SCHOOL_TYPE}}
**Data Protection Officer:** {{DPO_NAME}}
**Headteacher:** {{HEADTEACHER_NAME}}
**Chair of Governors:** {{CHAIR_OF_GOVERNORS}}
**Approved:** {{APPROVAL_DATE}}
**Next Review:** {{REVIEW_DATE}}
**Academic Year:** {{ACADEMIC_YEAR}}

---

## 1. Aims and Scope

{{SCHOOL_NAME}} is committed to processing personal data lawfully, fairly, and transparently in accordance with the [UK General Data Protection Regulation (UK GDPR)](https://www.legislation.gov.uk/eur/2016/679/contents) and the [Data Protection Act 2018 (DPA 2018)](https://www.legislation.gov.uk/ukpga/2018/12/contents), as amended by the [Data (Use and Access) Act 2025 (DUAA 2025)](https://www.legislation.gov.uk/ukpga/2025/18/contents).

This policy applies to all personal data processed by or on behalf of {{SCHOOL_NAME}}, including data relating to pupils, staff, governors, parents, and visitors.

## 2. Data Protection Officer

{{SCHOOL_NAME}} has appointed {{DPO_NAME}} as its Data Protection Officer (DPO). The DPO can be contacted via {{SCHOOL_WEBSITE}}.

The DPO is responsible for:
- Advising the school on its data protection obligations
- Monitoring compliance with UK GDPR and this policy
- Acting as the primary point of contact with the Information Commissioner's Office (ICO)

## 3. Lawful Bases for Processing

{{SCHOOL_NAME}} processes personal data only where a lawful basis exists. The school relies primarily on the following bases:

- **Public task** (Article 6(1)(e)) — processing necessary for the performance of a task carried out in the public interest or in the exercise of official authority (the education of pupils)
- **Legal obligation** (Article 6(1)(c)) — processing required to comply with a statutory obligation
- **Vital interests** (Article 6(1)(d)) — where processing is necessary to protect life
- **Consent** (Article 6(1)(a)) — where no other basis applies and the data subject has provided clear, freely given consent

For special category data (health, ethnicity, SEN), the school relies on Article 9(2)(g) (substantial public interest) and the conditions in Schedule 1 of the DPA 2018.

## 4. Individual Rights

Under UK GDPR, individuals have the following rights, which {{SCHOOL_NAME}} will uphold:

- **Right of access** — individuals may submit a Subject Access Request (SAR). The school will respond within one month.
- **Right to rectification** — individuals may request correction of inaccurate data.
- **Right to erasure** — in limited circumstances, individuals may request deletion.
- **Right to object** — individuals may object to processing based on legitimate interests or public task.
- **Right to data portability** — where processing is based on consent or contract and carried out by automated means.

### Complaints (DUAA 2025 — in force 19 June 2026)

Under section 164A of the DPA 2018 (as inserted by DUAA 2025), individuals have a statutory right to complain directly to {{SCHOOL_NAME}} about how their personal data is handled. {{SCHOOL_NAME}} will acknowledge any such complaint within **30 days** and investigate it promptly. Where a complaint cannot be resolved internally, individuals may escalate to the ICO at [ico.org.uk/make-a-complaint](https://ico.org.uk/make-a-complaint/).

## 5. Data Retention

{{SCHOOL_NAME}} retains personal data only for as long as necessary, in accordance with the [DfE Records Management and Retention Guidance](https://www.gov.uk/guidance/records-management-and-retention-and-disposal-policy).

A full retention schedule is maintained and reviewed annually by the DPO.

## 6. Data Security

{{SCHOOL_NAME}} implements appropriate technical and organisational measures to protect personal data against unauthorised access, loss, or destruction. These include:

- Role-based access controls and unique login credentials for all staff
- Encryption of portable devices and removable media
- A documented data breach response procedure, including mandatory reporting to the ICO within 72 hours where required

Staff must report any actual or suspected breach immediately to {{DPO_NAME}}.

## 7. Third Parties and Data Processors

Where {{SCHOOL_NAME}} engages third-party data processors, it will:
- Enter into a written data processing agreement meeting the requirements of UK GDPR Article 28
- Carry out appropriate due diligence before engagement
- Ensure processors provide sufficient guarantees about technical and organisational security measures

## 8. Training

All staff who handle personal data will receive data protection training on appointment and as part of annual safeguarding training. The DPO will provide updated briefings whenever legislation or guidance changes materially.

## 9. Linked Policies

This policy should be read alongside:
- Online Safety & Acceptable Use Policy
- CCTV Policy
- Photographs and Images Policy
- Privacy Notice (Pupils and Parents)
- Information Asset Register

## 10. Monitoring and Review

{{HEADTEACHER_NAME}}, as headteacher, is responsible for ensuring this policy is implemented. {{DPO_NAME}} will monitor compliance and report to governors annually. This policy will be reviewed by **{{REVIEW_DATE}}** or sooner if legislation or guidance changes.

**Approved by Governors:** {{APPROVAL_DATE}}
**Signed:** {{HEADTEACHER_NAME}}, Headteacher | {{CHAIR_OF_GOVERNORS}}, Chair of Governors
$$),

('Online Safety & Acceptable Use Policy', 'online_safety',
 'Covers KCSIE, Online Safety Act 2023, DfE filtering and monitoring standards, and UK GDPR obligations for online activity.',
 true, 2,
$$# Online Safety & Acceptable Use Policy

**School:** {{SCHOOL_NAME}}
**Designated Safeguarding Lead:** {{DSL_NAME}}
**Data Protection Officer:** {{DPO_NAME}}
**Headteacher:** {{HEADTEACHER_NAME}}
**Chair of Governors:** {{CHAIR_OF_GOVERNORS}}
**Approved:** {{APPROVAL_DATE}}
**Next Review:** {{REVIEW_DATE}}
**Academic Year:** {{ACADEMIC_YEAR}}

---

## 1. Purpose

{{SCHOOL_NAME}} is committed to ensuring all pupils and staff use technology safely, responsibly, and legally. This policy sets out the school's expectations for online conduct and the measures in place to protect pupils and staff from online risks.

This policy is drawn from:
- [Keeping Children Safe in Education (KCSIE)](https://www.gov.uk/government/publications/keeping-children-safe-in-education--2)
- [Online Safety Act 2023](https://www.legislation.gov.uk/ukpga/2023/50/contents)
- [DfE Filtering and Monitoring Standards](https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/filtering-and-monitoring-standards-for-schools-and-colleges)
- [UK GDPR](https://www.legislation.gov.uk/eur/2016/679/contents) and [Data Protection Act 2018](https://www.legislation.gov.uk/ukpga/2018/12/contents)

## 2. Roles and Responsibilities

| Role | Responsibility |
|------|---------------|
| Headteacher ({{HEADTEACHER_NAME}}) | Overall strategic responsibility for online safety |
| DSL ({{DSL_NAME}}) | Day-to-day lead for online safety; receives and acts on filtering/monitoring alerts |
| DPO ({{DPO_NAME}}) | Advises on data protection implications of online activity |
| Chair of Governors ({{CHAIR_OF_GOVERNORS}}) | Provides governance oversight; annual review of this policy |
| All staff | Complete annual online safety training; model safe use |
| Pupils | Follow the Acceptable Use Agreement (AUA) |

## 3. Filtering and Monitoring

{{SCHOOL_NAME}} maintains filtering and monitoring systems that meet the [DfE Filtering and Monitoring Standards](https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/filtering-and-monitoring-standards-for-schools-and-colleges). Specifically:

- Filtering is configured to block content categorised as illegal (IWF/Internet Watch Foundation list) and harmful
- The DSL receives automated alerts for attempts to access inappropriate content
- Monitoring logs are retained for a minimum of 90 days
- The filtering solution is reviewed annually by the DSL and a nominated governor

Changes to filtering categories require DSL approval and are documented.

## 4. Acceptable Use — Pupils

Pupils at {{SCHOOL_NAME}} must:
- Use school devices and networks only for educational purposes unless otherwise permitted
- Not share login credentials or access another pupil's account
- Not access, create, or share content that is illegal, harmful, or offensive
- Report concerns about online safety to any member of staff or directly to the DSL

Pupils must not use personal devices during lesson time unless specifically directed by a teacher.

## 5. Acceptable Use — Staff

Staff must:
- Use school-issued accounts for all professional communication
- Not share pupil data via personal email or consumer cloud services
- Complete online safety training annually and act on DSL guidance
- Report any safeguarding concern identified via monitoring or direct disclosure to {{DSL_NAME}} without delay

## 6. Social Media

Staff must not contact pupils via personal social media accounts. Any school social media presence must be approved by the headteacher and comply with the school's communications policy.

## 7. Reporting and Response

Any online safety concern — including cyberbullying, exposure to harmful content, or grooming — must be reported immediately to {{DSL_NAME}}. The DSL will follow the school's safeguarding procedures and, where appropriate, refer to the LADO, police, or other agencies in line with [KCSIE](https://www.gov.uk/government/publications/keeping-children-safe-in-education--2) and [Working Together to Safeguard Children](https://www.gov.uk/government/publications/working-together-to-safeguard-children--2).

## 8. Education and Curriculum

{{SCHOOL_NAME}} embeds online safety education across the curriculum and in personal development sessions. Pupils are taught to:
- Recognise online risks including scams, grooming, and radicalisation
- Protect their personal information
- Seek help from a trusted adult

## 9. Review

This policy will be reviewed by **{{REVIEW_DATE}}** or immediately following any significant online safety incident.

**Approved by Governors:** {{APPROVAL_DATE}}
**Signed:** {{HEADTEACHER_NAME}}, Headteacher | {{CHAIR_OF_GOVERNORS}}, Chair of Governors
$$),

('Artificial Intelligence (AI) Policy', 'ai',
 'Covers DfE generative AI guidance, UK GDPR data protection requirements for AI tools, academic integrity, and staff/pupil use expectations.',
 true, 3,
$$# Artificial Intelligence (AI) Policy

**School:** {{SCHOOL_NAME}}
**Headteacher:** {{HEADTEACHER_NAME}}
**Data Protection Officer:** {{DPO_NAME}}
**Designated Safeguarding Lead:** {{DSL_NAME}}
**Chair of Governors:** {{CHAIR_OF_GOVERNORS}}
**Approved:** {{APPROVAL_DATE}}
**Next Review:** {{REVIEW_DATE}}
**Academic Year:** {{ACADEMIC_YEAR}}

---

## 1. Purpose

This policy sets out how {{SCHOOL_NAME}} governs the use of artificial intelligence (AI) tools — including generative AI — by staff and pupils, consistent with the [DfE guidance on generative AI in education](https://www.gov.uk/government/publications/generative-artificial-intelligence-in-education), the [UK GDPR](https://www.legislation.gov.uk/eur/2016/679/contents), [KCSIE](https://www.gov.uk/government/publications/keeping-children-safe-in-education--2), and the [Data Protection Act 2018](https://www.legislation.gov.uk/ukpga/2018/12/contents).

## 2. Scope

This policy applies to all AI tools used at {{SCHOOL_NAME}}, including but not limited to: large language models (e.g. ChatGPT, Copilot, Gemini), AI image generators, AI-assisted marking tools, and speech-to-text systems.

## 3. Approved Tools

{{SCHOOL_NAME}} maintains an approved list of AI tools. Staff must not introduce a new AI tool for professional use without prior approval from the headteacher and confirmation from the DPO that a Data Protection Impact Assessment (DPIA) has been completed or is not required.

The approved tool list is reviewed termly by the headteacher and DPO.

## 4. Data Protection

AI tools must not be used to process:
- Names, contact details, or other identifiers of pupils or staff outside approved tools
- Special category data (health, SEN, ethnicity) without explicit DPO sign-off
- Any data relating to child protection or safeguarding matters

Staff must not enter pupil personal data into consumer AI tools (e.g. free-tier chatbot interfaces) unless the tool is on the school's approved list and a DPA/processing agreement is in place with the provider.

{{DPO_NAME}} is responsible for advising on and maintaining DPIA records for all AI tools in use.

## 5. Staff Use

Staff may use approved AI tools to support lesson planning, resource creation, administrative drafting, and professional development. Staff must:

- Be transparent with pupils when AI-generated content has informed teaching materials
- Critically review all AI outputs before use — AI tools can produce inaccurate, biased, or misleading content
- Not use AI to make or substantially influence high-stakes decisions about individual pupils (e.g. assessment grades, SEN provision) without human review and documentation

## 6. Pupil Use

{{SCHOOL_NAME}} recognises that pupils will encounter AI tools in education and wider life. The school's approach is to develop critical AI literacy rather than impose blanket prohibitions.

Pupils may use approved AI tools for learning activities where explicitly directed by a teacher. Pupils must not:
- Submit AI-generated work as their own without attribution
- Use AI tools to create harmful, offensive, or illegal content
- Share personal information about themselves or others with AI tools outside the approved list

Violations of this policy may be treated as academic misconduct and dealt with under the school's behaviour policy.

## 7. Safeguarding

{{DSL_NAME}} and the senior leadership team will remain alert to safeguarding risks arising from AI use, including AI-generated harmful content and the use of AI in grooming. Any concern must be reported and handled in accordance with [KCSIE](https://www.gov.uk/government/publications/keeping-children-safe-in-education--2).

## 8. Bias and Equality

{{SCHOOL_NAME}} recognises that AI tools can reflect and amplify bias. Staff must critically evaluate AI outputs for potential bias, particularly where content relates to protected characteristics under the [Equality Act 2010](https://www.legislation.gov.uk/ukpga/2010/15/contents).

## 9. Training

All staff will receive AI awareness training as part of CPD. The DPO will provide guidance on data protection obligations when new AI tools are introduced.

## 10. Review

This policy will be reviewed by **{{REVIEW_DATE}}** or sooner if DfE guidance or relevant legislation changes materially.

**Approved by Governors:** {{APPROVAL_DATE}}
**Signed:** {{HEADTEACHER_NAME}}, Headteacher | {{CHAIR_OF_GOVERNORS}}, Chair of Governors
$$),

('CCTV & Video Surveillance Policy', 'cctv',
 'Covers ICO CCTV guidance, Surveillance Camera Code of Practice, and UK GDPR transparency obligations.',
 false, 4,
$$# CCTV & Video Surveillance Policy

**School:** {{SCHOOL_NAME}}
**Data Controller:** {{SCHOOL_NAME}}
**Data Protection Officer:** {{DPO_NAME}}
**Headteacher:** {{HEADTEACHER_NAME}}
**Chair of Governors:** {{CHAIR_OF_GOVERNORS}}
**Approved:** {{APPROVAL_DATE}}
**Next Review:** {{REVIEW_DATE}}
**Academic Year:** {{ACADEMIC_YEAR}}

---

## 1. Purpose

{{SCHOOL_NAME}} operates a closed-circuit television (CCTV) system for the purposes of:
- Deterring and detecting crime and anti-social behaviour
- Supporting the safeguarding and security of pupils, staff, and visitors
- Supporting the investigation of incidents on school premises

CCTV is operated in accordance with the [UK GDPR](https://www.legislation.gov.uk/eur/2016/679/contents), [Data Protection Act 2018](https://www.legislation.gov.uk/ukpga/2018/12/contents), [ICO CCTV guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/cctv-and-video-surveillance/), and the [Surveillance Camera Code of Practice](https://www.gov.uk/government/publications/update-to-surveillance-camera-code).

## 2. Lawful Basis

{{SCHOOL_NAME}} processes CCTV footage under Article 6(1)(e) UK GDPR (public task) and, where footage captures sensitive information, Article 9(2)(g) (substantial public interest). The school's legitimate purposes for using CCTV are documented in its privacy notice.

## 3. Camera Locations and Coverage

CCTV cameras are positioned to cover:
- School entrances and exits
- External perimeter areas and car parks
- Internal communal areas (corridors, reception)

Cameras are **not** positioned in areas where there is a reasonable expectation of privacy, including changing rooms, toilets, and medical rooms.

A site map showing camera locations is held by {{HEADTEACHER_NAME}} and is available on request to authorised persons.

## 4. Signage

{{SCHOOL_NAME}} displays clear, visible CCTV signage at all entrances and at points where cameras are in operation. Signage includes the identity of the data controller and contact details for enquiries.

## 5. Retention

CCTV footage is retained for a maximum of **31 days** unless it is required for the investigation of an incident, a legal proceeding, or a law enforcement request, in which case it will be retained until the matter is resolved.

## 6. Access and Disclosure

Access to live or recorded CCTV footage is restricted to {{HEADTEACHER_NAME}} and designated senior staff. Footage will only be disclosed to third parties (including the police) where:
- There is a lawful basis for disclosure
- A formal request has been made and documented
- {{DPO_NAME}} has been consulted

## 7. Individual Rights

Individuals captured on CCTV footage have the right to request access to footage in which they appear (Subject Access Request). Requests must be made in writing to the DPO. The school will respond within one month and redact third-party individuals where necessary.

Under section 164A of the DPA 2018 (in force 19 June 2026), individuals also have a statutory right to complain to {{SCHOOL_NAME}} about how their data is handled. Complaints will be acknowledged within 30 days.

## 8. System Maintenance

The CCTV system will be checked and maintained at least annually. {{HEADTEACHER_NAME}} is responsible for ensuring the system is operational and that any faults are reported and remedied promptly.

## 9. Review

This policy will be reviewed by **{{REVIEW_DATE}}** or sooner if the regulatory framework changes.

**Approved by Governors:** {{APPROVAL_DATE}}
**Signed:** {{HEADTEACHER_NAME}}, Headteacher | {{CHAIR_OF_GOVERNORS}}, Chair of Governors
$$),

('Photographs and Images of Pupils Policy', 'photos',
 'Covers ICO guidance on photographs of children, UK GDPR consent and legitimate interest bases, and safeguarding obligations under KCSIE.',
 false, 5,
$$# Photographs and Images of Pupils Policy

**School:** {{SCHOOL_NAME}}
**Data Protection Officer:** {{DPO_NAME}}
**Designated Safeguarding Lead:** {{DSL_NAME}}
**Headteacher:** {{HEADTEACHER_NAME}}
**Chair of Governors:** {{CHAIR_OF_GOVERNORS}}
**Approved:** {{APPROVAL_DATE}}
**Next Review:** {{REVIEW_DATE}}
**Academic Year:** {{ACADEMIC_YEAR}}

---

## 1. Purpose

This policy governs the taking, use, storage, and publication of photographs and video images involving pupils at {{SCHOOL_NAME}}, consistent with the [UK GDPR](https://www.legislation.gov.uk/eur/2016/679/contents), [Data Protection Act 2018](https://www.legislation.gov.uk/ukpga/2018/12/contents), [ICO guidance on photographs of children](https://ico.org.uk/for-organisations/advice-for-small-organisations/frequently-asked-questions/photographs-and-videos/), and [KCSIE](https://www.gov.uk/government/publications/keeping-children-safe-in-education--2).

## 2. Lawful Basis

{{SCHOOL_NAME}} uses photographs and images of pupils for:
- **School prospectus, website, and newsletters** — lawful basis: legitimate interests (promoting the school; balanced against pupil privacy rights)
- **Educational records and reports** — lawful basis: public task
- **Press and local media** — lawful basis: consent

Where the school relies on legitimate interests, parents/carers are informed via the school's privacy notice and have the right to object at any time.

## 3. Consent

On admission, {{SCHOOL_NAME}} asks parents/carers to complete a photography consent form indicating:
- Consent for photographs to be taken for internal educational use
- Consent for photographs to be published on the school website or social media
- Consent for photographs to be shared with local press

Consent can be withdrawn at any time by contacting the school office. Where consent is withdrawn, images will be removed from the school website within a reasonable timescale.

For pupils aged 13 or over, the school may also seek the pupil's own consent in addition to parental consent.

## 4. Safeguarding

In line with [KCSIE](https://www.gov.uk/government/publications/keeping-children-safe-in-education--2), {{SCHOOL_NAME}} does not publish images of pupils where:
- A child is subject to a court order prohibiting publication of identifying information
- The DSL ({{DSL_NAME}}) or headteacher has determined publication would place a pupil at risk

The DSL must be consulted before any image is published where there is any concern about a pupil's safety.

## 5. Use of Images

Photographs and video of pupils will:
- Not include the pupil's full name alongside their image in any publicly accessible publication, unless consent has been explicitly given for this
- Not be published on personal social media accounts of staff
- Be stored securely in line with the school's data retention schedule

## 6. Third Parties

Parents, carers, and other visitors taking photographs at school events must do so for personal use only. Images must not be published on social media where other children are identifiable without the consent of those children's parents/carers. {{SCHOOL_NAME}} will communicate this at events via a notice or verbal reminder.

## 7. Drones and Body-worn Cameras

Any proposal to use drones or body-worn cameras on school premises must be approved in advance by {{HEADTEACHER_NAME}} and reviewed by {{DPO_NAME}} for compliance with UK GDPR and the Surveillance Camera Code.

## 8. Review

This policy will be reviewed by **{{REVIEW_DATE}}** or sooner if guidance changes.

**Approved by Governors:** {{APPROVAL_DATE}}
**Signed:** {{HEADTEACHER_NAME}}, Headteacher | {{CHAIR_OF_GOVERNORS}}, Chair of Governors
$$);
