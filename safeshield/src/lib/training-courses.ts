// Seed data for Training & Certification Module
// These courses are upserted to Supabase when admin opens the Training tab

import { type SupabaseClient } from "@supabase/supabase-js";

export type SeedLesson = {
  id: string;
  title: string;
  content: string;
  duration_minutes: number;
  has_quiz: boolean;
  quiz?: { question: string; options: string[]; correct_answer: number; explanation: string }[];
};

export type SeedSection = {
  id: string;
  title: string;
  lessons: SeedLesson[];
};

export type SeedCourse = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  duration_minutes: number;
  thumbnail_color: string;
  sections: SeedSection[];
};

export const SEED_COURSES: SeedCourse[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 1: Safeguarding & Child Protection Essentials
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "c1000000-0000-0000-0000-000000000001",
    title: "Safeguarding & Child Protection Essentials",
    description:
      "A foundational course for all school staff covering safeguarding duties, recognising abuse, and reporting responsibilities under KCSIE 2024.",
    category: "Safeguarding",
    level: "beginner",
    duration_minutes: 45,
    thumbnail_color: "#34D399",
    sections: [
      {
        id: "s1010000-0000-0000-0000-000000000001",
        title: "Understanding Safeguarding",
        lessons: [
          {
            id: "l1010100-0000-0000-0000-000000000001",
            title: "What is Safeguarding?",
            duration_minutes: 10,
            has_quiz: true,
            content: `Safeguarding is the action taken to promote the welfare of children and protect them from harm. It is everyone's responsibility — not just the Designated Safeguarding Lead (DSL), but every single member of staff who works with or comes into contact with children.\n\nThe legal framework for safeguarding in England is built on several key pieces of legislation and statutory guidance:\n\n• The Children Act 1989 established the principle that the child's welfare is paramount and created the framework for child protection services.\n• The Children Act 2004 strengthened multi-agency working and led to the creation of safeguarding partnerships between schools, health services, and the police.\n• Working Together to Safeguard Children 2023 is the primary statutory guidance that sets out how organisations and agencies should work together to safeguard and promote the welfare of children. It reinforces that safeguarding is everybody's business.\n• Keeping Children Safe in Education (KCSIE) 2024 is the statutory guidance specifically for schools and colleges. All school staff must read and understand at least Part One of KCSIE.\n\nSafeguarding means more than preventing abuse. It includes protecting children from maltreatment, preventing the impairment of children's health or development, ensuring children are growing up in circumstances consistent with the provision of safe and effective care, and taking action to enable all children to have the best outcomes.\n\nAs a member of school staff, your duty of care means you must act in the best interests of the children in your care at all times. This is not optional — it is a professional and legal obligation. If you have a concern about a child, no matter how small it seems, you must act on it. The phrase often used is: "it is better to report a concern that turns out to be nothing than to fail to report one that turns out to be serious."\n\nEvery school must have a Designated Safeguarding Lead (DSL) — a senior member of staff trained to Level 3 safeguarding standard. They are the first point of contact for any concern you raise. You should know who your DSL is and how to contact them.\n\nSafeguarding also covers wider welfare issues including mental health, domestic abuse in the home, radicalisation, exploitation, and online safety. Schools are uniquely placed to identify children who may be at risk because staff see them daily and can notice changes in behaviour or demeanour.`,
            quiz: [
              {
                question: "Which statutory guidance do all school staff need to read at least Part One of?",
                options: [
                  "Working Together to Safeguard Children 2023",
                  "Keeping Children Safe in Education 2024",
                  "The Children Act 2004",
                  "The Education Act 2011",
                ],
                correct_answer: 1,
                explanation:
                  "KCSIE 2024 is the statutory guidance specifically for schools. All staff must read at least Part One.",
              },
              {
                question: "Whose responsibility is safeguarding in a school?",
                options: [
                  "Only the Designated Safeguarding Lead",
                  "Only teaching staff",
                  "Every member of staff",
                  "Only the headteacher and senior leaders",
                ],
                correct_answer: 2,
                explanation:
                  "Safeguarding is everyone's responsibility. Every member of staff has a duty of care towards the children they work with.",
              },
              {
                question: "What does the Children Act 2004 primarily strengthen?",
                options: [
                  "Criminal sentencing for child abuse",
                  "Multi-agency working and safeguarding partnerships",
                  "School inspection frameworks",
                  "Teacher qualification requirements",
                ],
                correct_answer: 1,
                explanation:
                  "The Children Act 2004 strengthened multi-agency working and led to the creation of local safeguarding partnerships.",
              },
            ],
          },
          {
            id: "l1010200-0000-0000-0000-000000000001",
            title: "Recognising Abuse and Neglect",
            duration_minutes: 12,
            has_quiz: true,
            content: `Recognising the signs and indicators of abuse and neglect is a fundamental skill for all school staff. There are four main categories of abuse, each with its own signs and indicators — though these can overlap, and a child may be experiencing more than one type of abuse simultaneously.\n\n• Physical abuse involves deliberately causing physical harm to a child. It may involve hitting, shaking, throwing, poisoning, burning, scalding, drowning, or suffocating. Signs include unexplained injuries, bruising in unusual places (such as the torso, back, or buttocks), injuries that don't match the explanation given, flinching when touched, or fear of going home.\n\n• Emotional abuse is the persistent emotional maltreatment of a child that causes severe and persistent adverse effects on their emotional development. It includes conveying that children are worthless, unloved, or inadequate. Signs may be less visible — look for low self-esteem, excessive clinginess or detachment, age-inappropriate behaviours, persistent self-harm, or statements suggesting the child feels unloved.\n\n• Sexual abuse involves forcing or enticing a child to take part in sexual activities, whether or not the child is aware of what is happening. This includes contact activities (such as touching) and non-contact activities (such as showing pornography or grooming online). Signs include sexual knowledge inappropriate for the child's age, sexually explicit play, physical symptoms in the genital area, regression in behaviour, or sudden changes in behaviour.\n\n• Neglect is the persistent failure to meet a child's basic physical and/or psychological needs, likely to result in serious impairment of the child's health or development. Signs include persistent hunger, poor hygiene, inadequate clothing for the weather, persistent tiredness, frequent absence, or medical needs that go unattended.\n\nEarly identification is critical. Research consistently shows that the earlier concerns are identified and acted upon, the better the outcomes for children. Abuse often goes undetected because signs are subtle or because adults make excuses or rationalisations for what they observe.\n\nIf you notice any of these indicators, you should not investigate yourself. Your role is to observe, record what you have seen or heard using the child's exact words where relevant, and report to the DSL promptly. Remember that abuse is rarely a single incident — it is often a pattern that builds over time, and your observation may be one piece of a larger picture.\n\nNever make promises of confidentiality to a child who discloses abuse. You must always tell them that you may need to share what they have told you in order to keep them safe.`,
            quiz: [
              {
                question: "A child arrives at school in dirty clothes, appears hungry, and has missed several medical appointments. This is most likely an indicator of which type of abuse?",
                options: ["Physical abuse", "Emotional abuse", "Sexual abuse", "Neglect"],
                correct_answer: 3,
                explanation:
                  "Persistent poor hygiene, hunger, and unmet medical needs are classic indicators of neglect — failure to meet a child's basic needs.",
              },
              {
                question: "What should you do if a child discloses abuse to you?",
                options: [
                  "Investigate the matter yourself before reporting",
                  "Promise the child you will keep it secret",
                  "Record what the child said and report to the DSL",
                  "Confront the alleged abuser directly",
                ],
                correct_answer: 2,
                explanation:
                  "You should listen carefully, record using the child's own words, and report to the DSL promptly. Never investigate yourself or promise confidentiality.",
              },
              {
                question: "Which of these is NOT one of the four main categories of abuse?",
                options: ["Physical abuse", "Financial abuse", "Sexual abuse", "Emotional abuse"],
                correct_answer: 1,
                explanation:
                  "The four main categories are physical, emotional, sexual abuse, and neglect. Financial abuse is a category of adult abuse, not the main framework for child abuse.",
              },
            ],
          },
        ],
      },
      {
        id: "s1020000-0000-0000-0000-000000000001",
        title: "Your Responsibilities",
        lessons: [
          {
            id: "l1020100-0000-0000-0000-000000000001",
            title: "Reporting Concerns Correctly",
            duration_minutes: 12,
            has_quiz: true,
            content: `Knowing how to report a safeguarding concern correctly is just as important as knowing how to recognise one. The process exists to protect both the child and the member of staff raising the concern.\n\nWhen you have a safeguarding concern, you should report it to your Designated Safeguarding Lead (DSL) as soon as possible — the same day if the concern is serious. Do not wait until the end of the week or try to gather more evidence yourself. In the DSL's absence, report to the Deputy DSL.\n\nWhat information to record:\n• The date and time of the observation or disclosure\n• Exactly what you observed or what the child said — use the child's own words, not your interpretation\n• The context (where were you, who else was present?)\n• Any physical signs you observed (describe accurately without diagnosing)\n• Your name and role\n\nIt is essential to record facts, not opinions or judgements. Write "the child had a bruise on their left forearm approximately 3cm in length," not "the child had been beaten." Your record may be used in legal proceedings, so accuracy and objectivity are vital.\n\nKCSIE 2024 makes clear that any member of staff can refer directly to Children's Services or the police in an emergency — you do not always have to go through the DSL first. If you believe a child is in immediate danger, call 999.\n\nThe importance of not promising confidentiality cannot be overstated. If a child approaches you and says "can you keep a secret?" you must explain that you will listen but may need to share what you hear with someone who can help. If a child has already disclosed something in confidence, you must still report it. Tell the child honestly: "I care about you and I have to make sure you are safe, which means I need to tell someone who can help."\n\nMulti-agency working is central to effective safeguarding. Your school's DSL works with social workers, the police, health services, and other agencies to assess risk and plan responses. The Early Help Assessment process exists to support children who don't meet the threshold for a formal child protection referral but still need additional support.\n\nEvery school must have a safeguarding policy. You should read and understand it. It will detail your school's specific procedures, the names of DSLs, and how to escalate concerns if you feel they are not being taken seriously.`,
            quiz: [
              {
                question: "When should you report a serious safeguarding concern to the DSL?",
                options: [
                  "Within 48 hours",
                  "The same day, as soon as possible",
                  "At the weekly staff meeting",
                  "Only if you have multiple pieces of evidence",
                ],
                correct_answer: 1,
                explanation:
                  "Serious concerns should be reported to the DSL the same day. Delaying could put a child at further risk.",
              },
              {
                question: "How should you record what a child says during a disclosure?",
                options: [
                  "In your own words, summarising the key points",
                  "Using professional terminology to describe the abuse",
                  "Using the child's exact words as accurately as possible",
                  "You should not record it — verbal reports are sufficient",
                ],
                correct_answer: 2,
                explanation:
                  "Always use the child's exact words. Your record may be used in legal proceedings, so accuracy is critical.",
              },
              {
                question: "Under KCSIE 2024, what can you do if you believe a child is in immediate danger and the DSL is unavailable?",
                options: [
                  "Wait until the DSL returns",
                  "Call the police or Children's Services directly",
                  "Speak to a teaching colleague first",
                  "Take the child home yourself",
                ],
                correct_answer: 1,
                explanation:
                  "KCSIE 2024 is clear that any member of staff can refer directly to Children's Services or police in an emergency — call 999 if there is immediate danger.",
              },
            ],
          },
          {
            id: "l1020200-0000-0000-0000-000000000001",
            title: "Online Safety and Digital Safeguarding",
            duration_minutes: 11,
            has_quiz: true,
            content: `Online safety is now inseparable from safeguarding. Children and young people spend significant portions of their lives online, and the risks they face online are as real and serious as those they face in the physical world. KCSIE 2024 dedicates substantial guidance to online safety, and all school staff need to understand the key risks and their responsibilities.\n\nKey online risks for children include:\n\n• Online grooming — adults using the internet to build trust with a child with the intent to exploit them sexually. Groomers often pretend to be peers, offer gifts or special attention, and gradually normalise sexual conversation. Signs a child may be being groomed include secretive behaviour online, receiving unexplained gifts, staying up late on devices, and becoming withdrawn.\n\n• Child Sexual Abuse Material (CSAM) — the production, distribution, or possession of images depicting the sexual abuse of children is a serious criminal offence. If you encounter or are made aware of such material, do not attempt to investigate or preserve the evidence yourself. Report immediately to the DSL, who will involve the police.\n\n• Cyberbullying — the use of digital technology to harass, intimidate, or humiliate. This can take place on social media, messaging apps, or online gaming platforms. Effects on victims can be severe, including depression, anxiety, and self-harm.\n\n• Radicalisation and extremism — the internet is used by extremist groups to radicalise young people. The Prevent duty requires schools to have due regard to the need to prevent children from being drawn into terrorism. If you have concerns about a child being radicalised, report to your DSL, who can make a referral to Channel.\n\nFiltering and monitoring requirements: All schools must have appropriate filtering and monitoring solutions in place. KCSIE 2024 requires governors and leaders to review these annually. Filtering blocks access to harmful content; monitoring detects concerning activity. Monitoring must be used appropriately and staff should be aware of what is monitored.\n\nThe Child Exploitation and Online Protection command (CEOP) provides reporting tools and resources. The CEOP Safety Centre at ceop.police.uk allows children, parents, and professionals to report concerns about online abuse. All school staff should be aware of CEOP and be able to signpost children and parents to it.\n\nRemember: if a child discloses something about their online experiences, apply the same approach as any other safeguarding disclosure — listen, record accurately, do not promise confidentiality, and report to the DSL promptly.`,
            quiz: [
              {
                question: "Which organisation provides the primary reporting tool for online child sexual abuse in the UK?",
                options: ["Childline", "NSPCC", "CEOP (Child Exploitation and Online Protection)", "SafeCall"],
                correct_answer: 2,
                explanation:
                  "CEOP (Child Exploitation and Online Protection command) operates the CEOP Safety Centre where online abuse can be reported.",
              },
              {
                question: "A child tells you they have been receiving gifts from an adult they met online who sends them messages late at night. What is this most likely to be?",
                options: [
                  "A harmless pen-pal relationship",
                  "A sign of online grooming",
                  "An example of cyberbullying",
                  "A radicalisation concern",
                ],
                correct_answer: 1,
                explanation:
                  "Receiving gifts from unknown adults online and secretive late-night communication are classic indicators of online grooming.",
              },
              {
                question: "Under KCSIE 2024, how often should schools review their filtering and monitoring solutions?",
                options: ["Monthly", "Termly", "Annually", "Every three years"],
                correct_answer: 2,
                explanation:
                  "KCSIE 2024 requires governors and leaders to review their filtering and monitoring solutions at least annually.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 2: UK GDPR & Data Protection for School Staff
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "c2000000-0000-0000-0000-000000000002",
    title: "UK GDPR & Data Protection for School Staff",
    description:
      "Understand your data protection obligations under UK GDPR, how to handle pupil and staff data safely, and what to do when a data breach occurs.",
    category: "Data Protection",
    level: "beginner",
    duration_minutes: 40,
    thumbnail_color: "#3B82F6",
    sections: [
      {
        id: "s2010000-0000-0000-0000-000000000002",
        title: "GDPR Fundamentals",
        lessons: [
          {
            id: "l2010100-0000-0000-0000-000000000002",
            title: "What is UK GDPR and Why It Matters",
            duration_minutes: 10,
            has_quiz: true,
            content: `The UK General Data Protection Regulation (UK GDPR), alongside the Data Protection Act 2018, is the primary data protection law in the United Kingdom. Following Brexit, the UK retained the principles of EU GDPR but applied them in a UK-specific context. For schools, compliance with UK GDPR is not optional — it is a legal requirement, and failure to comply can result in significant fines from the Information Commissioner's Office (ICO) and serious reputational damage.\n\nThe six key principles of UK GDPR require that personal data must be:\n\n• Processed lawfully, fairly, and transparently — individuals must know why their data is being used\n• Collected for specified, explicit, and legitimate purposes — data collected for one purpose cannot be used for another without justification\n• Adequate, relevant, and limited to what is necessary (data minimisation) — do not collect more data than you need\n• Accurate and kept up to date\n• Kept for no longer than necessary (storage limitation)\n• Processed in a way that ensures appropriate security (integrity and confidentiality)\n\nThere must also be a lawful basis for processing personal data. The six lawful bases are: consent, contract, legal obligation, vital interests, public task, and legitimate interests. Schools most commonly rely on public task (exercising official authority) and legal obligation (complying with a legal requirement) as their lawful bases, rather than consent — which is important to understand because it means schools generally don't need to ask for consent to process data they are legally required to process.\n\nThe difference between a data controller and a data processor is important. A data controller determines the purposes and means of processing personal data — this is the school or trust. A data processor processes data on behalf of the controller — for example, a third-party IT provider or MIS system. Controllers have primary legal responsibility; processors must have a data processing agreement in place.\n\nSchools are legally required to register with the ICO as data controllers, paying an annual fee (currently £40 for most schools). Non-registration is a criminal offence. The ICO is the UK's independent regulator for data protection and can investigate complaints, carry out audits, and impose fines up to £17.5 million or 4% of annual global turnover for the most serious breaches.`,
            quiz: [
              {
                question: "What is the most common lawful basis used by schools for processing personal data?",
                options: ["Consent", "Legitimate interests", "Public task and legal obligation", "Vital interests"],
                correct_answer: 2,
                explanation:
                  "Schools most commonly rely on public task (exercising official authority) and legal obligation rather than consent.",
              },
              {
                question: "What is a data processor?",
                options: [
                  "The school that decides how data is used",
                  "A third party that processes data on behalf of the school",
                  "Any member of staff who handles pupil records",
                  "The ICO when investigating a complaint",
                ],
                correct_answer: 1,
                explanation:
                  "A data processor processes data on behalf of the data controller (the school). Examples include IT providers and MIS vendors.",
              },
              {
                question: "What is the maximum fine the ICO can impose for the most serious data protection breaches?",
                options: ["£500,000", "£1.5 million", "£17.5 million or 4% of global turnover", "£10,000"],
                correct_answer: 2,
                explanation:
                  "Under UK GDPR, the ICO can fine up to £17.5 million or 4% of annual global turnover for the most serious breaches.",
              },
            ],
          },
          {
            id: "l2010200-0000-0000-0000-000000000002",
            title: "Personal Data and Special Category Data",
            duration_minutes: 10,
            has_quiz: true,
            content: `Understanding what counts as personal data — and which data requires extra protection — is fundamental to day-to-day compliance in a school setting.\n\nPersonal data is any information that relates to an identified or identifiable living individual. This is much broader than many people realise. It includes:\n\n• Names and addresses\n• Email addresses\n• Phone numbers\n• Pupil ID numbers\n• Photographs and CCTV footage\n• IP addresses\n• Assessment grades and progress data\n• Attendance records\n• Behavioural incident records\n• Free school meal eligibility\n\nEven seemingly anonymous data can become personal data if it can be combined with other information to identify an individual — this is known as "jigsaw identification."\n\nSpecial category data receives significantly stronger protection under UK GDPR because of its particular sensitivity. The special categories are:\n\n• Racial or ethnic origin\n• Political opinions\n• Religious or philosophical beliefs\n• Trade union membership\n• Genetic data\n• Biometric data where used for identification (such as fingerprint attendance systems)\n• Health data — including SEND needs, medical conditions, mental health records\n• Sex life or sexual orientation\n\nFor schools, the most commonly processed special category data relates to health (including SEND and mental health), ethnicity (for census returns), and religion (for RE and admissions in faith schools). Processing special category data requires both a lawful basis under Article 6 UK GDPR and a separate condition under Article 9.\n\nData about criminal convictions and offences is treated separately from special categories — it is not a special category itself but has its own heightened protection under the Data Protection Act 2018. This is relevant when schools are considering DBS check information for staff.\n\nIn practice, this means: be thoughtful about who has access to special category data, ensure it is stored securely (not in shared spreadsheets without access controls), only process it when there is a clear lawful basis, and never share it casually — for example, do not mention a pupil's mental health diagnosis in a general email.`,
            quiz: [
              {
                question: "Which of the following is an example of special category data that schools commonly process?",
                options: [
                  "Pupil names and addresses",
                  "School dinner preferences (non-dietary)",
                  "SEND needs and health conditions",
                  "Assessment grades",
                ],
                correct_answer: 2,
                explanation:
                  "Health data, including SEND needs and medical conditions, is special category data that requires additional protection.",
              },
              {
                question: "A school uses fingerprint scanners for attendance. What type of data does this involve?",
                options: [
                  "Ordinary personal data",
                  "Criminal conviction data",
                  "Biometric data — a special category",
                  "Anonymised data outside GDPR scope",
                ],
                correct_answer: 2,
                explanation:
                  "Biometric data used for identification purposes (such as fingerprint attendance systems) is a special category under UK GDPR.",
              },
              {
                question: "What does 'jigsaw identification' mean in data protection?",
                options: [
                  "A method of encrypting pupil records",
                  "Combining multiple pieces of information to identify an individual",
                  "A technique for anonymising data",
                  "The process of conducting a DPIA",
                ],
                correct_answer: 1,
                explanation:
                  "Jigsaw identification refers to combining multiple data points that individually may seem anonymous but together can identify a person.",
              },
            ],
          },
        ],
      },
      {
        id: "s2020000-0000-0000-0000-000000000002",
        title: "Your Day-to-Day Obligations",
        lessons: [
          {
            id: "l2020100-0000-0000-0000-000000000002",
            title: "Handling Pupil and Staff Data Safely",
            duration_minutes: 10,
            has_quiz: true,
            content: `UK GDPR compliance is not just a policy document — it shapes how you handle data in your everyday work. Here are the key principles and practices every school staff member should follow.\n\nAccess controls: Only access data you need for your specific role. If you are a class teacher, you need access to your class's data — not necessarily every pupil in the school's full records. This is the principle of least privilege. Do not share login credentials for systems that hold personal data.\n\nEmail best practices: Email is one of the most common causes of data breaches in schools. Key rules include:\n• Always double-check recipients before sending — it is easy to autofill the wrong address\n• Do not send personal data, especially special category data, in unencrypted emails\n• Do not CC where BCC would be appropriate (avoid accidentally revealing email addresses)\n• Avoid emailing lists of pupils with their grades or progress — use secure portals where available\n• If you must send sensitive data by email, use password-protected attachments and send the password separately\n\nWorking from home: If you work on school data from home, you must ensure the same level of security as in school. This means:\n• Only use school-approved devices or secure, encrypted personal devices for school data\n• Use a VPN if required by your school's IT policy\n• Do not leave screens visible to others in public spaces\n• Do not save school data to personal cloud services (Google Drive, Dropbox) without authorisation\n• Lock your screen when leaving your device\n\nDevice security: Devices used to access personal data must be password-protected or use biometric authentication. Lost or stolen devices must be reported to the school's Data Protection Officer (DPO) or IT lead immediately. Even a lost unencrypted USB drive containing pupil data is a reportable breach.\n\nNot sharing data unnecessarily: Apply the data minimisation principle — only share what is needed, with those who need it, for the time it is needed. If a parent asks for another family's contact details, you cannot provide these. If a journalist asks about a pupil, refer them to the headteacher or communications lead immediately.\n\nPaper records: Data protection is not just about digital data. Paper records containing personal data should be stored securely, not left on desks overnight, and disposed of via confidential waste (shredding), not general recycling.`,
            quiz: [
              {
                question: "What is the 'principle of least privilege' in data protection?",
                options: [
                  "Only managers can access personal data",
                  "Staff should only access the data they need for their specific role",
                  "Pupil data should be deleted after one year",
                  "All staff should share login credentials for efficiency",
                ],
                correct_answer: 1,
                explanation:
                  "The principle of least privilege means only accessing the data you genuinely need for your specific role — limiting unnecessary exposure.",
              },
              {
                question: "A colleague asks if they can save a spreadsheet of pupil data to their personal Dropbox so they can work from home. What should you advise?",
                options: [
                  "That's fine as long as the spreadsheet is password-protected",
                  "No — they should use school-approved secure methods for remote working",
                  "Yes, personal cloud services are GDPR-compliant",
                  "Only if the headteacher verbally approves it",
                ],
                correct_answer: 1,
                explanation:
                  "Personal cloud services without school authorisation are not an approved method for storing school data. Staff must use school-approved secure methods.",
              },
              {
                question: "A USB drive containing pupil records is lost. What should happen?",
                options: [
                  "Nothing, as long as the data was on an encrypted drive",
                  "Wait to see if it turns up before reporting",
                  "Report it immediately to the DPO or IT lead as a potential data breach",
                  "Only report it if special category data was on the drive",
                ],
                correct_answer: 2,
                explanation:
                  "A lost device or storage medium containing personal data must be reported immediately — it may be a reportable breach regardless of encryption status.",
              },
            ],
          },
          {
            id: "l2020200-0000-0000-0000-000000000002",
            title: "Data Breaches — How to Respond",
            duration_minutes: 10,
            has_quiz: true,
            content: `A data breach is any security incident that leads to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to personal data. Breaches are not always the result of a malicious cyber attack — in schools, the most common breaches are caused by human error, such as sending an email to the wrong person, losing a device, or sharing data without authorisation.\n\nExamples of data breaches in schools include:\n• Sending pupil assessment data to the wrong email address\n• A laptop containing staff payroll records being stolen from a car\n• A shared Google Doc with pupil medical information being accidentally made publicly viewable\n• A paper attendance register being left on a bus\n• An unauthorised person accessing the school's MIS system\n\nWhat constitutes a breach requiring ICO notification: Under UK GDPR, schools have 72 hours from becoming aware of a breach to notify the ICO — if the breach is likely to result in a risk to individuals' rights and freedoms. This is a tight window. Not every breach needs to be reported to the ICO, but all breaches must be recorded internally, even those that do not meet the reporting threshold.\n\nThe internal reporting process you should follow:\n1. Identify the breach — what data is involved, how many individuals, what are the likely consequences?\n2. Contain the breach where possible — recall emails, change passwords, report lost devices\n3. Report immediately to your Data Protection Officer (DPO) or line manager — do not wait\n4. Document everything — what happened, when, how it was discovered, what action was taken\n5. The DPO will assess whether ICO notification is required within 72 hours\n\nThe breach register: Every organisation must maintain a breach register documenting all breaches, whether or not they are reported to the ICO. This is part of the accountability principle under UK GDPR. The register shows what happened, who was affected, what the risk assessment concluded, and what action was taken.\n\nMinimising harm: After a breach, consider what can be done to reduce the impact on the individuals affected. In some cases, you may also need to notify the individuals whose data was breached — particularly if there is a high risk to them. Your DPO will guide this process.\n\nRemember: reporting a breach quickly and transparently demonstrates compliance and good faith. Attempting to conceal a breach makes things significantly worse.`,
            quiz: [
              {
                question: "How many hours does a school have to report a qualifying data breach to the ICO?",
                options: ["24 hours", "48 hours", "72 hours", "7 days"],
                correct_answer: 2,
                explanation:
                  "UK GDPR requires notification to the ICO within 72 hours of becoming aware of a breach that poses a risk to individuals.",
              },
              {
                question: "A teacher accidentally sends a class report email to the wrong parent. What should they do first?",
                options: [
                  "Wait to see if the parent notices",
                  "Delete the sent email and hope for the best",
                  "Report it to the DPO immediately and try to recall the email",
                  "Only report if the email contained special category data",
                ],
                correct_answer: 2,
                explanation:
                  "Any suspected breach must be reported to the DPO immediately so it can be assessed, contained where possible, and recorded in the breach register.",
              },
              {
                question: "Which of the following must always be maintained by the school, even for minor breaches that don't require ICO notification?",
                options: [
                  "A public statement on the school website",
                  "An internal breach register",
                  "A formal complaint to the ICO",
                  "A letter to all parents",
                ],
                correct_answer: 1,
                explanation:
                  "All breaches — even minor ones not requiring ICO notification — must be recorded in an internal breach register. This demonstrates accountability.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 3: AI Tools in Schools — Safe & Responsible Use
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "c3000000-0000-0000-0000-000000000003",
    title: "AI Tools in Schools — Safe & Responsible Use",
    description:
      "Understand how generative AI works, its legitimate uses in education, and the critical safeguards needed to protect pupils and comply with data protection law.",
    category: "AI & Technology",
    level: "intermediate",
    duration_minutes: 50,
    thumbnail_color: "#F59E0B",
    sections: [
      {
        id: "s3010000-0000-0000-0000-000000000003",
        title: "Understanding AI in Education",
        lessons: [
          {
            id: "l3010100-0000-0000-0000-000000000003",
            title: "How Generative AI Works",
            duration_minutes: 12,
            has_quiz: true,
            content: `Generative AI refers to artificial intelligence systems that can generate text, images, code, audio, and other content in response to prompts. Tools like ChatGPT, Google Gemini, Microsoft Copilot, and Claude are examples of generative AI that many school staff encounter in their daily work. Understanding how these tools work — and their inherent limitations — is essential before using them professionally.\n\nLarge Language Models (LLMs) are the technology behind most generative AI text tools. They are trained on vast quantities of text data — books, websites, academic papers, social media, and more — and learn to predict what text should come next given an input. This is a statistical process, not genuine understanding or reasoning. An LLM does not "know" things the way a human does; it produces outputs that are statistically likely to be coherent and relevant based on its training data.\n\nKey limitations you must understand:\n\n• Hallucinations — LLMs sometimes produce information that sounds plausible and confident but is factually incorrect. This is called a "hallucination." An AI tool may cite a non-existent research paper, state an incorrect legal provision, or give wrong numerical data — all with the same fluent confidence as when it is correct. You must always verify important factual claims from AI outputs using authoritative sources.\n\n• Bias — LLMs reflect the biases present in their training data, which includes the full breadth of human-generated text, including its prejudices. This can manifest in subtle ways: reinforcing stereotypes, producing outputs that favour certain demographics, or applying different standards to different groups. Be critically aware of this when using AI to generate content about pupils or communities.\n\n• Training data cut-offs — most LLMs have a knowledge cut-off date. They are not aware of events, legislation, or guidance published after that date unless they have access to real-time search tools. This is particularly important for legal and regulatory questions.\n\n• No accountability — AI tools do not take responsibility for their outputs. You, as a professional, are accountable for anything you produce using AI assistance. "The AI said so" is not a defence in a professional context.\n\nMicrosoft Copilot is integrated into Microsoft 365 applications used by many schools. It has specific data handling protections for enterprise customers. Google Gemini similarly has specific protections for Google Workspace for Education users. However, free consumer versions of these tools do not have the same protections — this distinction is critically important for data protection compliance.`,
            quiz: [
              {
                question: "What is an AI 'hallucination'?",
                options: [
                  "When an AI tool crashes and produces no output",
                  "When an AI produces confident-sounding but factually incorrect information",
                  "A visual glitch in AI-generated images",
                  "When an AI refuses to answer a question",
                ],
                correct_answer: 1,
                explanation:
                  "Hallucination refers to AI generating plausible-sounding but factually incorrect content — a key reason all AI outputs must be verified.",
              },
              {
                question: "Why must you be aware of LLM training data cut-offs?",
                options: [
                  "Because older models are less intelligent",
                  "Because the AI may not know about recent legislation, guidance, or events",
                  "Because cut-off data makes the AI produce hallucinations",
                  "Because it affects the AI's ability to write in British English",
                ],
                correct_answer: 1,
                explanation:
                  "LLMs are not aware of developments after their training cut-off. This is crucial when asking about recent laws, DfE guidance, or current events.",
              },
              {
                question: "If an AI tool produces incorrect advice that you include in a school policy, who is accountable?",
                options: [
                  "The AI company that developed the tool",
                  "The school's IT department for allowing the tool",
                  "You, as the professional who used and published the output",
                  "No one, as AI outputs are not legally attributable",
                ],
                correct_answer: 2,
                explanation:
                  "You are professionally accountable for content you produce, regardless of whether AI assisted. 'The AI said so' is not a defence.",
              },
            ],
          },
          {
            id: "l3010200-0000-0000-0000-000000000003",
            title: "Benefits and Risks for Schools",
            duration_minutes: 13,
            has_quiz: true,
            content: `Generative AI offers genuine and significant benefits for schools, but these must be balanced against equally significant risks. A mature, professional approach to AI means neither dismissing the tools entirely nor adopting them uncritically.\n\nLegitimate and valuable uses of AI in schools include:\n\n• Lesson planning — AI can rapidly generate lesson plan frameworks, differentiated activities, starter activities, and homework tasks. This can save teachers considerable time, freeing them for higher-value work. The outputs should always be reviewed, personalised, and adapted by the teacher before use.\n\n• Differentiation — AI can help generate adapted materials for pupils with different needs, such as simplified text for lower-ability readers, extended challenge questions for gifted pupils, or alternative formats for SEND pupils.\n\n• Administrative reduction — AI tools can help draft letters, reports, meeting summaries, job descriptions, and policy documents. Again, human review is essential before publication.\n\n• Professional development — AI can be used to research topics, generate CPD materials, or provide explanations of complex concepts.\n\nKey risks that must be managed:\n\n• Data input risk — this is the most critical risk. Consumer AI tools (the free, public versions of ChatGPT, Gemini etc.) train on inputs in many configurations. You must NEVER enter personal pupil data, staff data, or any identifiable information into consumer AI tools. This would constitute a data breach under UK GDPR.\n\n• Misinformation and accuracy — as discussed in the previous lesson, AI outputs must be verified. Using unverified AI outputs in communications to parents, assessments, or policies is a professional risk.\n\n• Academic integrity — AI raises profound questions about assessment validity. Pupils submitting AI-generated work as their own is a form of academic dishonesty. Schools need clear policies on what use of AI is permitted in pupil work, and staff need to understand detection approaches and their limitations.\n\n• Pupil safeguarding and AI — children may be accessing AI tools independently, including for harmful purposes (generating violent content, bypassing safeguards, or being manipulated by AI companions). This is an evolving safeguarding risk that schools should address in their online safety provision.\n\n• Over-reliance and deskilling — professional judgement must not be replaced by AI. Teaching, safeguarding, and pastoral care require human relationship, empathy, and contextual understanding that AI cannot replicate.`,
            quiz: [
              {
                question: "Why should you NEVER enter personal pupil data into a consumer AI tool?",
                options: [
                  "It slows the AI down and produces worse results",
                  "Consumer AI tools may train on your inputs, constituting a UK GDPR data breach",
                  "It violates the school's acceptable use policy only",
                  "The AI will share the data with the pupil's parents",
                ],
                correct_answer: 1,
                explanation:
                  "Consumer AI tools can train on user inputs. Entering personal pupil data risks a UK GDPR data breach and must never happen.",
              },
              {
                question: "Which of the following is a legitimate use of AI for school staff?",
                options: [
                  "Entering a pupil's SEND needs into ChatGPT to generate their EHCP",
                  "Using AI to generate differentiated reading materials which you then review and adapt",
                  "Letting AI fully write and publish a safeguarding policy without review",
                  "Allowing pupils to use AI to complete their GCSE coursework",
                ],
                correct_answer: 1,
                explanation:
                  "Generating differentiated materials for human review and adaptation is a legitimate use. The key is human oversight and no personal data input.",
              },
              {
                question: "What is 'academic integrity' in the context of AI in schools?",
                options: [
                  "Ensuring AI tools are academically rigorous",
                  "Making sure pupils are not submitting AI-generated work as their own",
                  "Verifying that AI has a university-level education",
                  "Checking that AI outputs match the national curriculum",
                ],
                correct_answer: 1,
                explanation:
                  "Academic integrity refers to the principle that pupils' submitted work represents their own understanding. AI-generated work submitted as the pupil's own is a form of dishonesty.",
              },
            ],
          },
        ],
      },
      {
        id: "s3020000-0000-0000-0000-000000000003",
        title: "Using AI Responsibly",
        lessons: [
          {
            id: "l3020100-0000-0000-0000-000000000003",
            title: "Your School's AI Policy",
            duration_minutes: 12,
            has_quiz: true,
            content: `Every school should now have an AI policy — or an AI section within its ICT/acceptable use policy — that guides how staff and pupils can and cannot use AI tools. As a staff member, understanding and following your school's AI policy is a professional obligation.\n\nWhat a school AI policy should cover:\n\n• Approved tools: The policy should specify which AI tools have been approved for use by staff, and in which contexts. Tools approved for enterprise use (such as Microsoft Copilot for Schools through Microsoft 365 Education, or Google Gemini in a Google Workspace for Education environment) have data protection safeguards. Consumer free versions do not. Staff should only use approved tools.\n\n• Unapproved tools: The policy should be clear that staff must not use unapproved AI tools with school data. The temptation to use a freely available consumer tool for convenience is understandable but creates real legal risk.\n\n• Academic integrity for pupils: The policy should set out what is and isn't permitted for pupils when completing work. This will vary by key stage, subject, and assessment type. Staff need to know these rules so they can apply and enforce them consistently and explain them to pupils.\n\n• The absolute rule — never input personal pupil data into consumer AI: This cannot be repeated enough. No pupil's name, SEND information, personal details, or any other data that could identify them should ever be entered into a public AI tool. Not even with names changed — contextual information can still be identifying. This applies to staff data too.\n\nHandling grey areas: Sometimes it isn't obvious whether an AI use is appropriate. When in doubt, ask your DPO, IT lead, or line manager before proceeding. It is always better to seek guidance than to act and create a compliance problem.\n\nStaying up to date: AI technology is evolving rapidly. The DfE has published guidance on generative AI in education and continues to update it. Your school's AI policy should be reviewed at least annually. Being engaged with this evolving landscape is part of being a digitally literate professional in the modern school context.\n\nDocumenting AI use: Some schools require staff to note where AI has been used in producing documents — particularly policies, reports, or communications. This transparency is good practice and helps maintain accountability.`,
            quiz: [
              {
                question: "What is the key difference between Microsoft Copilot in a school Microsoft 365 subscription and the free consumer ChatGPT?",
                options: [
                  "Copilot is less intelligent and produces worse results",
                  "Copilot has enterprise data protection safeguards; consumer ChatGPT does not",
                  "Consumer ChatGPT is better for lesson planning",
                  "There is no practical difference for school use",
                ],
                correct_answer: 1,
                explanation:
                  "Enterprise AI tools like Copilot for Education have data protection agreements. Consumer tools do not have these protections, making them unsuitable for school data.",
              },
              {
                question: "A teacher wants to use an AI tool not listed in the school's AI policy because it is more powerful. What should they do?",
                options: [
                  "Use it anyway as long as they don't input personal data",
                  "Seek approval from the DPO or IT lead before using it",
                  "Ask a colleague if they think it seems safe",
                  "Use it on a personal device to avoid school liability",
                ],
                correct_answer: 1,
                explanation:
                  "Unapproved tools should not be used with school data. The correct approach is to seek guidance from the DPO or IT lead before using any unlisted tool.",
              },
              {
                question: "A teacher changes a pupil's name to 'Pupil A' before entering their SEND details into a consumer AI tool. Is this acceptable?",
                options: [
                  "Yes, because the name is removed the data is anonymous",
                  "No — contextual SEND information can still be identifying and must not enter consumer AI",
                  "Yes, as long as no medical details are included",
                  "Only acceptable if the pupil's parents have consented",
                ],
                correct_answer: 1,
                explanation:
                  "Removing a name is not enough. Contextual details about a specific pupil can still identify them. Personal data of any kind must not enter consumer AI tools.",
              },
            ],
          },
          {
            id: "l3020200-0000-0000-0000-000000000003",
            title: "Data Protection and AI",
            duration_minutes: 13,
            has_quiz: true,
            content: `When schools use AI tools that process personal data, data protection law applies fully. Understanding the intersection of AI and UK GDPR is increasingly important as schools adopt more digital tools.\n\nData Protection Impact Assessments (DPIAs): Under UK GDPR, a DPIA is required before implementing any high-risk processing of personal data — and AI tools that process personal data about children are likely to meet this threshold. A DPIA is a structured process for identifying and minimising data protection risks. It should be completed before deploying an AI tool, not after. Key questions a DPIA addresses include: What data will the AI process? What is the lawful basis? Who has access? What are the risks? How will they be mitigated?\n\nChecking vendor compliance: Before adopting any AI tool that will handle school data, the school (through its DPO or IT lead) must review the vendor's privacy policy, terms of service, and data processing agreement. Key questions include:\n• Where is the data processed and stored? (UK/EEA preferred; transfers outside require safeguards)\n• Does the vendor train their models on your data?\n• What security measures are in place?\n• What are the data retention periods?\n• Is there a signed Data Processing Agreement (DPA)?\n\nDfE guidance on AI procurement: The Department for Education has published guidance on procuring AI tools for schools, which includes a checklist of data protection requirements. Schools should use this guidance when evaluating any AI product. The guidance emphasises that schools must not use tools that use pupil data to train AI models.\n\nUK GDPR and automated decision-making: Article 22 of UK GDPR gives individuals the right not to be subject to solely automated decisions that significantly affect them. Using AI to make decisions about pupils — such as automated assessment grading that determines their course options — without human review may breach this right. Human oversight of AI-assisted decisions about pupils is therefore not just good practice, it may be a legal requirement.\n\nTransparency: Schools have a duty to be transparent about how they use personal data, including AI processing. Privacy notices should be updated to reflect AI use. Parents and pupils have the right to know if AI tools are processing their data.`,
            quiz: [
              {
                question: "What is a DPIA?",
                options: [
                  "A Digital Privacy Internal Audit",
                  "A Data Protection Impact Assessment — required before high-risk data processing",
                  "A Department for Education procurement framework",
                  "A document certifying an AI tool is GDPR-compliant",
                ],
                correct_answer: 1,
                explanation:
                  "A DPIA (Data Protection Impact Assessment) is a structured process to identify and mitigate data protection risks, required before high-risk processing such as AI tools handling pupil data.",
              },
              {
                question: "Under UK GDPR Article 22, what right do individuals have regarding automated decision-making?",
                options: [
                  "The right to access all data used by AI about them",
                  "The right not to be subject to solely automated decisions that significantly affect them",
                  "The right to opt out of any AI processing",
                  "The right to have AI decisions explained in plain English",
                ],
                correct_answer: 1,
                explanation:
                  "Article 22 gives individuals the right not to be subject to solely automated decisions with significant effects — human oversight of AI decisions about pupils is therefore required.",
              },
              {
                question: "A vendor's terms state they will use school data to improve and train their AI model. Is this acceptable?",
                options: [
                  "Yes, as long as the data is anonymised by the vendor",
                  "No — schools must not use tools that train AI models on pupil data, per DfE guidance",
                  "Yes, if the school has obtained parental consent",
                  "Only acceptable for non-special category data",
                ],
                correct_answer: 1,
                explanation:
                  "DfE guidance explicitly states schools must not use AI tools that train their models on pupil data. This is a firm requirement in vendor selection.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 4: Health & Safety Awareness for School Staff
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "c4000000-0000-0000-0000-000000000004",
    title: "Health & Safety Awareness for School Staff",
    description:
      "Core health and safety knowledge for all school staff, covering legal duties, fire safety, manual handling, DSE, first aid, and accident reporting.",
    category: "Health & Safety",
    level: "beginner",
    duration_minutes: 35,
    thumbnail_color: "#F97316",
    sections: [
      {
        id: "s4010000-0000-0000-0000-000000000004",
        title: "Core H&S Responsibilities",
        lessons: [
          {
            id: "l4010100-0000-0000-0000-000000000004",
            title: "Your Legal Duties Under H&S Law",
            duration_minutes: 9,
            has_quiz: true,
            content: `Health and safety in the workplace is governed by a comprehensive legal framework that places duties on both employers and employees. Understanding your legal obligations is the foundation of a safe working environment in schools.\n\nThe Health and Safety at Work etc. Act 1974 (HSWA) is the primary piece of health and safety legislation in Great Britain. It sets out the general duties that employers have towards employees and the public, and duties that employees have to themselves and each other.\n\nEmployer duties under HSWA include:\n• Providing a safe working environment, so far as is reasonably practicable\n• Providing safe equipment and systems of work\n• Providing adequate information, instruction, training, and supervision\n• Providing a safe place of work with safe access and egress\n• Ensuring the welfare of employees at work\n\nEmployee duties: The HSWA also places legal duties on you as an employee. You must:\n• Take reasonable care of your own health and safety and that of others affected by your work\n• Co-operate with your employer on health and safety matters\n• Not interfere with or misuse anything provided for health and safety purposes\n\nYour right to refuse unsafe work: You have a legal right to refuse work you reasonably believe poses serious and imminent danger. If you are asked to carry out a task that you believe is unsafe and your concerns are dismissed, you should escalate to your union representative or the Health and Safety Executive (HSE) if necessary.\n\nNear-miss reporting: A near-miss is an unplanned event that did not result in injury but had the potential to do so — for example, a loose paving stone that a colleague nearly tripped on. Near-misses should always be reported because they reveal hazards that, if left unaddressed, are likely to cause an accident in the future. Your school should have a near-miss reporting procedure.\n\nRIDDOR (Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013) requires employers to report certain serious workplace incidents to the HSE. Reportable incidents include deaths, specified injuries (such as fractures, amputations, or injuries requiring hospitalisation over seven days), and dangerous occurrences (such as a building collapse or explosion). Reporting to HSE is not the same as your school's internal accident reporting — both must happen.\n\nThe Management of Health and Safety at Work Regulations 1999 require employers to conduct risk assessments for significant hazards. Schools must have risk assessments covering activities like school trips, science experiments, physical education, and manual handling. You should be aware of the risk assessments relevant to your role.`,
            quiz: [
              {
                question: "Which Act is the primary piece of health and safety legislation in Great Britain?",
                options: [
                  "The Management of Health and Safety at Work Regulations 1999",
                  "The Health and Safety at Work etc. Act 1974",
                  "RIDDOR 2013",
                  "The Workplace Health, Safety and Welfare Regulations 1992",
                ],
                correct_answer: 1,
                explanation:
                  "The Health and Safety at Work etc. Act 1974 is the primary H&S legislation, placing duties on both employers and employees.",
              },
              {
                question: "What is a near-miss and why should it be reported?",
                options: [
                  "A minor injury that didn't require first aid — reported for insurance purposes",
                  "An unplanned event that could have caused injury — reported to prevent future accidents",
                  "A RIDDOR-reportable incident that narrowly missed a serious outcome",
                  "A fire alarm activation that turned out to be a false alarm",
                ],
                correct_answer: 1,
                explanation:
                  "A near-miss is an event that didn't cause injury but could have. Reporting them reveals hazards before they cause harm.",
              },
              {
                question: "Under RIDDOR, which of the following must be reported to the HSE?",
                options: [
                  "A pupil grazing their knee in the playground",
                  "A member of staff suffering a fracture at work",
                  "A teacher developing a headache from working at a computer",
                  "A student feeling unwell after lunch",
                ],
                correct_answer: 1,
                explanation:
                  "RIDDOR requires reporting of specified injuries to employees, including fractures. Minor injuries and illnesses that do not meet specified thresholds are not RIDDOR-reportable.",
              },
            ],
          },
          {
            id: "l4010200-0000-0000-0000-000000000004",
            title: "Fire Safety in Schools",
            duration_minutes: 9,
            has_quiz: true,
            content: `Fire safety is a critical component of health and safety in schools. Given that schools accommodate large numbers of children and staff, and often contain a mix of older and newer buildings, fire safety procedures must be understood and followed rigorously by every member of staff.\n\nThe Regulatory Reform (Fire Safety) Order 2005 is the primary fire safety legislation applying to non-domestic premises including schools. It requires the "responsible person" (usually the headteacher or premises manager) to carry out a fire risk assessment and implement appropriate precautions.\n\nFire risk assessments: Schools must have a written fire risk assessment, reviewed regularly, that identifies hazards, evaluates risks, implements control measures, and records findings. As a staff member, you should know where this document is kept and understand the controls that apply to your working area.\n\nFire doors: Fire doors are a critical element of passive fire protection. They are designed to stop the spread of fire and smoke for a rated period (typically 30 or 60 minutes). They must never be propped open — a propped fire door provides no protection. If you see a fire door wedged open, remove the wedge and report it. Fire doors with automatic hold-open devices (linked to the fire alarm) are acceptable — they close automatically when the alarm activates.\n\nEvacuation drills: Schools must carry out regular fire evacuation drills — at least one per term is good practice. Drills exist to ensure that pupils and staff know what to do and can evacuate safely. You must know your evacuation route, assembly point, and role in the evacuation procedure.\n\nPersonal Emergency Evacuation Plans (PEEPs): Any person — pupil or staff member — who may need assistance to evacuate (due to mobility issues, visual or hearing impairments, or other factors) must have a PEEP. If you work with any individuals who might need a PEEP, ensure one is in place and you know how to assist them.\n\nFire extinguisher types: Schools typically have multiple extinguisher types. The key rule is never use water extinguishers on electrical fires or burning liquids. CO2 extinguishers (black label) are for electrical fires. Foam extinguishers (cream label) are for burning liquids. Dry powder (blue label) has wider application but can damage equipment. Staff are not required to fight fires — evacuate first, use extinguishers only if trained, safe to do so, and the fire is small.\n\nWeekly alarm testing: Fire alarm systems should be tested weekly, typically at the same time on the same day. You should know when your school tests its alarm and not confuse a test activation with a real alarm.`,
            quiz: [
              {
                question: "Why must fire doors never be propped open?",
                options: [
                  "They create a trip hazard in corridors",
                  "A propped fire door provides no protection against fire and smoke spread",
                  "It damages the door mechanism",
                  "It violates building regulations only in new buildings",
                ],
                correct_answer: 1,
                explanation:
                  "Fire doors are designed to stop fire and smoke spread. When propped open, they provide no protection — this is a serious fire safety risk.",
              },
              {
                question: "What type of fire extinguisher should be used on an electrical fire?",
                options: [
                  "Water (red label)",
                  "Foam (cream label)",
                  "CO2 (black label)",
                  "Dry powder (blue label) only",
                ],
                correct_answer: 2,
                explanation:
                  "CO2 extinguishers (black label) are safe for use on electrical fires. Never use water on electrical fires as it conducts electricity.",
              },
              {
                question: "What is a PEEP?",
                options: [
                  "A Personal Emergency Evacuation Plan for those who may need assistance to evacuate",
                  "A fire safety inspection checklist",
                  "The post-evacuation register process",
                  "A fire prevention equipment protocol",
                ],
                correct_answer: 0,
                explanation:
                  "A PEEP (Personal Emergency Evacuation Plan) is required for any person who may need assistance evacuating — pupils or staff with mobility, sensory, or other needs.",
              },
            ],
          },
        ],
      },
      {
        id: "s4020000-0000-0000-0000-000000000004",
        title: "Everyday Safety",
        lessons: [
          {
            id: "l4020100-0000-0000-0000-000000000004",
            title: "Manual Handling and DSE",
            duration_minutes: 8,
            has_quiz: true,
            content: `Two of the most common causes of workplace injury and ill-health in schools are poor manual handling technique and inadequate Display Screen Equipment (DSE) setup. Both are preventable with proper awareness and practice.\n\nManual handling covers any activity that involves lifting, lowering, pushing, pulling, carrying, or moving loads. In schools, this includes moving boxes of books, classroom furniture, sports equipment, science apparatus, and catering supplies. The Manual Handling Operations Regulations 1992 require employers to avoid hazardous manual handling where possible, and to assess and reduce the risk where it cannot be avoided.\n\nCorrect lifting technique:\n• Plan the lift — assess the weight, route, and destination before you start\n• Position your feet shoulder-width apart with one foot slightly forward\n• Bend at the knees, not the waist — keep your back straight and in its natural curve\n• Grip the load firmly using both hands\n• Keep the load close to your body — the further away, the more strain on your back\n• Lift using your leg muscles, not your back\n• Avoid twisting — turn your feet to change direction, don't rotate your spine while loaded\n• Lower carefully using the same technique in reverse\n\nFor heavy or awkward loads, ask for help or use mechanical aids (trolleys, sack trucks). Never feel that you have to manage alone to avoid appearing unhelpful. Musculoskeletal injuries caused by poor manual handling can be long-term and debilitating.\n\nDisplay Screen Equipment (DSE): The Health and Safety (Display Screen Equipment) Regulations 1992 apply to workers who habitually use computers, tablets, or other screen-based equipment as a significant part of their work. This includes most teachers and office staff in schools. Employers must:\n• Carry out DSE assessments for habitual users\n• Ensure workstations meet minimum ergonomic requirements\n• Provide appropriate eye tests and corrective glasses if required\n\nWorkstation setup: Your screen should be at arm's length, with the top of the screen at or slightly below eye level. Your chair should support your lower back (lumbar support) with your feet flat on the floor or a footrest. Forearms should be roughly horizontal when typing. Elbows should be at desk height.\n\nEye strain and reporting: If you experience persistent headaches, eye strain, neck or back pain related to your workstation, report it to your line manager and request a DSE assessment. These are not trivial complaints — they are health issues your employer has a duty to address.`,
            quiz: [
              {
                question: "What is the correct principle for lifting technique?",
                options: [
                  "Bend at the waist to reach the load and straighten up quickly",
                  "Keep your back straight, bend your knees, and use your leg muscles",
                  "Keep the load as far from your body as possible for balance",
                  "Twist from the waist to turn with the load for efficiency",
                ],
                correct_answer: 1,
                explanation:
                  "Correct lifting requires straight back, bent knees, and using leg muscles — keeping the load close. Bending at the waist and twisting cause back injuries.",
              },
              {
                question: "Who do the DSE Regulations apply to?",
                options: [
                  "Only office staff, not teachers",
                  "All employees regardless of how much they use screens",
                  "Workers who habitually use screen-based equipment as a significant part of their work",
                  "Only employees who have already experienced eye strain",
                ],
                correct_answer: 2,
                explanation:
                  "DSE Regulations apply to habitual users — those who use screen-based equipment as a significant part of their normal work.",
              },
              {
                question: "Where should the top of your computer screen be positioned?",
                options: [
                  "Above eye level to reduce glare",
                  "At or slightly below eye level, at arm's length",
                  "Below your eye level to reduce neck strain",
                  "As close as possible to reduce eye strain",
                ],
                correct_answer: 1,
                explanation:
                  "The top of the screen should be at or slightly below eye level, at arm's length — this maintains a neutral neck position and reduces strain.",
              },
            ],
          },
          {
            id: "l4020200-0000-0000-0000-000000000004",
            title: "First Aid and Accident Reporting",
            duration_minutes: 9,
            has_quiz: true,
            content: `Knowing what to do in a health emergency and how to report accidents properly are essential skills for all school staff. You don't need to be a trained first aider to take important initial actions — knowing who to call and what basic steps to take can make a significant difference.\n\nThe Health and Safety (First Aid) Regulations 1981 require employers to provide adequate and appropriate first aid equipment, facilities, and personnel. Schools must have a sufficient number of qualified first aiders based on their risk assessment. First aiders hold a nationally recognised First Aid at Work (FAW) qualification, which must be renewed every three years.\n\nWho are your first aiders? Every member of staff should know the names of the school's first aiders and how to contact them quickly. This information is typically displayed on notice boards and in staff handbooks. Do not assume someone else will know — know it yourself.\n\nWhat to do in an emergency when you are not a first aider:\n1. Ensure the scene is safe — do not put yourself in danger\n2. Call for help — shout, use your radio/phone to contact a first aider or call 999 if necessary\n3. Stay with the person — reassure them and keep them still unless they are in immediate danger\n4. Do not move someone who may have a spinal injury unless they are at immediate risk\n5. If trained in CPR and defibrillator use, apply if appropriate and if the first aider has not yet arrived\n\nAccident book: Every workplace must keep an accident record. In schools, the accident book (or digital equivalent) must record any injury to an employee, pupil, or visitor on school premises. Entries should include: date and time, name and role of injured person, nature and location of injury, first aid treatment given, and who recorded it. The accident book is a legal record.\n\nRIDDOR reporting: As covered in the earlier lesson, certain incidents must also be reported to the HSE under RIDDOR. Your premises manager or business manager is typically responsible for HSE reporting, but you must ensure they are aware of any incident that may be RIDDOR-reportable.\n\nNear-miss reporting: Accidents should be recorded in the accident book even if the injury seems minor. And near-misses — where no injury occurred — should be reported through your school's hazard/near-miss reporting system. Building a culture where staff feel safe to report without blame is a hallmark of a mature health and safety culture.`,
            quiz: [
              {
                question: "How long is a First Aid at Work (FAW) qualification valid?",
                options: ["One year", "Two years", "Three years", "Five years"],
                correct_answer: 2,
                explanation:
                  "A First Aid at Work qualification is valid for three years and must be renewed by taking a refresher course before it expires.",
              },
              {
                question: "If you come across an injured colleague and are not a first aider, what should you do first?",
                options: [
                  "Attempt CPR immediately",
                  "Move them to a comfortable position",
                  "Ensure the scene is safe and call for a first aider or 999",
                  "Leave them and find someone qualified before returning",
                ],
                correct_answer: 2,
                explanation:
                  "First check the scene is safe, then call for a qualified first aider or 999 if needed. Stay with the person, but do not move them unnecessarily.",
              },
              {
                question: "What must be recorded in the accident book?",
                options: [
                  "Only injuries to staff, not pupils or visitors",
                  "Only injuries requiring hospital treatment",
                  "Any injury to an employee, pupil, or visitor on school premises",
                  "Only RIDDOR-reportable incidents",
                ],
                correct_answer: 2,
                explanation:
                  "The accident book must record all injuries on school premises — to staff, pupils, and visitors — regardless of severity.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 5: Digital Leadership for School Governors
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "c5000000-0000-0000-0000-000000000005",
    title: "Digital Leadership for School Governors",
    description:
      "Equip governors with the knowledge to provide effective strategic oversight of digital safety, data protection, AI governance, and cyber security in their school.",
    category: "Leadership",
    level: "intermediate",
    duration_minutes: 55,
    thumbnail_color: "#8B5CF6",
    sections: [
      {
        id: "s5010000-0000-0000-0000-000000000005",
        title: "Governor Oversight of Digital",
        lessons: [
          {
            id: "l5010100-0000-0000-0000-000000000005",
            title: "What Governors Must Know About Digital Safety",
            duration_minutes: 14,
            has_quiz: true,
            content: `School governors have a strategic oversight responsibility for the safety and welfare of all pupils and staff. In the digital age, this extends explicitly to online safety and the school's digital environment. KCSIE 2024 makes clear that governors and trustees play a vital role in ensuring their school fulfils its online safety obligations.\n\nGovernor duties under KCSIE 2024:\n• Governors must ensure the school has an effective and up-to-date online safety policy\n• Governors must satisfy themselves that the school has appropriate filtering and monitoring systems in place\n• Governors should receive a report on online safety at least annually — reviewing whether the filtering and monitoring solution is effective, proportionate, and reviewed\n• Governors should ensure that all staff have received appropriate online safety training\n• Governors should know who the Designated Safeguarding Lead is and satisfy themselves that they have the capacity, training, and support to fulfil the role\n\nFiltering and monitoring oversight: One of the most specific governor responsibilities in KCSIE 2024 relates to filtering and monitoring. Governors should:\n• Understand the difference between filtering (blocking harmful content) and monitoring (detecting concerning activity)\n• Ask school leaders what solution is in place and when it was last reviewed\n• Ensure the solution is appropriate for the age range in the school\n• Satisfy themselves that the monitoring approach is proportionate — it must not be so intrusive as to breach privacy rights\n\nAsking the right questions at board meetings: Governors do not need to be technical experts, but they do need to ask the right questions. Useful questions include:\n• When did we last review our online safety policy?\n• Has our filtering and monitoring solution been reviewed this year?\n• Have all staff completed online safety training in the last 12 months?\n• Have we had any online safety incidents this year and how were they managed?\n• Does our DSL have adequate time and support?\n\nThe annual online safety report: Best practice is for the DSL or a designated lead governor to present an annual online safety report to the full governing body. This should cover the year's incidents (in appropriately anonymised form), the status of filtering and monitoring, training completion rates, and any emerging risks or issues the board should be aware of.\n\nReputational and legal risk: Online safety failures can have serious consequences for schools — including Ofsted criticism, ICO investigation, reputational damage, and in serious cases, legal liability. Governors who demonstrate active oversight of digital safety are far better placed to manage these risks.`,
            quiz: [
              {
                question: "How often should governors receive a report on online safety, as a minimum?",
                options: ["Monthly", "Termly", "Annually", "Only when an incident occurs"],
                correct_answer: 2,
                explanation:
                  "KCSIE 2024 and best practice guidance recommend governors receive an online safety report at least annually.",
              },
              {
                question: "What is the difference between filtering and monitoring?",
                options: [
                  "Filtering detects concerning activity; monitoring blocks harmful content",
                  "Filtering blocks harmful content; monitoring detects concerning activity",
                  "They are the same thing described differently",
                  "Filtering applies to pupils; monitoring applies to staff",
                ],
                correct_answer: 1,
                explanation:
                  "Filtering blocks access to harmful content. Monitoring detects and alerts to concerning online activity. Both are required under KCSIE 2024.",
              },
              {
                question: "Governors are not required to be technical experts in digital safety. What IS required of them?",
                options: [
                  "Nothing — digital safety is entirely a leadership responsibility",
                  "Completing a Level 3 online safety qualification",
                  "Asking the right questions and ensuring effective oversight",
                  "Personally reviewing the filtering and monitoring logs",
                ],
                correct_answer: 2,
                explanation:
                  "Governors don't need technical expertise — they need to ask the right questions, receive appropriate reports, and ensure effective oversight systems are in place.",
              },
            ],
          },
          {
            id: "l5010200-0000-0000-0000-000000000005",
            title: "Data Protection Accountability for Governors",
            duration_minutes: 14,
            has_quiz: true,
            content: `Governors have specific and significant responsibilities under UK GDPR, flowing from the accountability principle — one of the six key principles of data protection law. Accountability means that schools must not only comply with data protection law, but must be able to demonstrate that they comply. Governors are part of this accountability chain.\n\nThe accountability principle in practice means governors should:\n• Ensure the school has a clear, up-to-date data protection policy\n• Receive and review an annual data protection report from the DPO\n• Satisfy themselves that the school has appropriate technical and organisational measures in place\n• Ensure the DPO appointment is appropriate and that the DPO has sufficient independence and resource\n\nData Protection Officer (DPO) appointment: Most schools that are public authorities (which includes maintained schools and academy trusts) are required to appoint a DPO under UK GDPR. The DPO can be an internal appointment or an external service provider. Governors should ensure:\n• The DPO is suitably qualified and knowledgeable about data protection law\n• The DPO has adequate time to perform their duties (this is a common failure — DPOs who are also full-time teachers cannot adequately fulfil the role)\n• The DPO reports directly to the highest management level (i.e., they should be able to report directly to the governing body)\n• The DPO is not penalised for performing their duties\n\nAnnual data protection report to the board: Best practice is for the DPO to present an annual report to governors covering: the school's compliance status, any data breaches during the year, subject access requests received and how they were handled, training completion rates, and any identified risks requiring governor attention.\n\nBreach oversight: When a significant data breach occurs, governors should be informed. For breaches that are reported to the ICO, governors should receive a briefing. This allows the board to provide oversight and ensure appropriate remedial action is taken.\n\nICO fines and reputational risk: While the ICO rarely fines schools, the reputational damage from a publicly investigated data breach can be severe. More commonly, the ICO issues improvement notices or makes adverse findings in investigation reports that become public. Governors should understand that proactive compliance reduces this risk significantly, and that poor data protection governance is an Ofsted concern under leadership and management.`,
            quiz: [
              {
                question: "Which UK GDPR principle requires schools to be able to demonstrate their compliance, not just comply?",
                options: [
                  "Data minimisation",
                  "Storage limitation",
                  "Accountability",
                  "Transparency",
                ],
                correct_answer: 2,
                explanation:
                  "The accountability principle requires organisations to be able to demonstrate their compliance with all other principles — it is the overarching governance principle.",
              },
              {
                question: "What is a common failure in DPO appointments that governors should check for?",
                options: [
                  "The DPO being too senior in the organisation",
                  "The DPO not having a law degree",
                  "The DPO having insufficient time to perform their duties (e.g., being a full-time teacher as well)",
                  "The DPO reporting to the governing body",
                ],
                correct_answer: 2,
                explanation:
                  "A very common failure is appointing a DPO who also has full-time other duties — they simply don't have adequate time to fulfil the role properly.",
              },
              {
                question: "When should governors be informed of a data breach?",
                options: [
                  "Only if the ICO issues a fine",
                  "Never — data breaches are purely operational matters",
                  "For significant breaches, particularly those reported to the ICO",
                  "Only at the annual DPO report",
                ],
                correct_answer: 2,
                explanation:
                  "Governors should be informed of significant breaches, especially those reported to the ICO, so they can provide oversight and ensure remedial action.",
              },
            ],
          },
        ],
      },
      {
        id: "s5020000-0000-0000-0000-000000000005",
        title: "Strategic Digital Leadership",
        lessons: [
          {
            id: "l5020100-0000-0000-0000-000000000005",
            title: "AI Governance at Board Level",
            duration_minutes: 13,
            has_quiz: true,
            content: `Artificial intelligence is now affecting schools directly — through tools used by staff, applications adopted for administration, and the AI tools pupils are accessing independently. Governors need a working understanding of AI governance to exercise effective oversight.\n\nDfE AI guidance: The Department for Education has published guidance on the use of generative AI in education. Key messages for governors include:\n• Schools should have a clear AI policy before deploying AI tools\n• Staff need appropriate training before using AI with school data\n• AI tools that process personal pupil data require a Data Protection Impact Assessment (DPIA)\n• Schools must not use AI tools that train their models on pupil data\n\nGovernor questions to ask about AI adoption: You do not need to understand the technology in depth — you need to ask questions that hold leadership to account:\n• Do we have an AI policy, and when was it last reviewed?\n• What AI tools are staff currently using, and have they been formally approved?\n• Have we completed a DPIA for any AI tools that process pupil data?\n• What training have staff received on safe and responsible AI use?\n• How are we addressing academic integrity — what is our policy on pupils using AI in their work?\n• Are pupils receiving online safety education about AI risks?\n\nDPIA oversight: Governors should ensure that the school has a process for completing DPIAs before adopting high-risk data processing tools, including AI. While governors do not conduct DPIAs themselves, they should receive assurance that the process exists and is being followed.\n\nStaff training accountability: If the school has adopted AI tools and staff have not been trained to use them safely, governors are in a difficult position if something goes wrong. Governors should ensure training has been completed and should receive evidence of this — not just assurances.\n\nAcademic integrity governance: This is a growing area of concern for boards. Governors should receive reports from senior leaders about how the school is managing academic integrity in an AI-enabled world — including what the school's published policy says, how it is communicated to pupils and parents, and how it is enforced.\n\nThe pace of change: AI is developing faster than any previous technology adopted in schools. Governors should expect the landscape to change significantly year on year, and should ensure the school has mechanisms to stay informed of emerging risks and regulatory developments.`,
            quiz: [
              {
                question: "What question should governors ask regarding AI tools that process pupil data?",
                options: [
                  "Which AI vendor is the cheapest?",
                  "Have we completed a DPIA for AI tools processing pupil data?",
                  "How many tokens does the AI model have?",
                  "Does the AI tool have a good user interface?",
                ],
                correct_answer: 1,
                explanation:
                  "Governors should ask whether DPIAs have been completed for AI tools processing pupil data — this is a UK GDPR requirement and a key governance question.",
              },
              {
                question: "According to DfE AI guidance, what must schools NOT do regarding AI tools?",
                options: [
                  "Use AI for lesson planning",
                  "Use AI tools that train their models on pupil data",
                  "Allow teachers to use AI for administrative tasks",
                  "Mention AI in their acceptable use policy",
                ],
                correct_answer: 1,
                explanation:
                  "DfE guidance is clear: schools must not use AI tools that train their models on pupil data. This is a firm requirement in AI tool selection.",
              },
              {
                question: "Why is academic integrity governance increasingly important for school boards?",
                options: [
                  "Because AI can now complete GCSEs better than most pupils",
                  "Because Ofsted requires governors to personally verify all pupil assessments",
                  "Because AI tools make it easier for pupils to submit AI-generated work as their own, requiring clear policies and enforcement",
                  "Because universities are reporting AI use positively",
                ],
                correct_answer: 2,
                explanation:
                  "AI tools lower the barrier to submitting machine-generated work as one's own. Boards need to ensure the school has clear, enforced policies on academic integrity.",
              },
            ],
          },
          {
            id: "l5020200-0000-0000-0000-000000000005",
            title: "Cyber Security — Board Responsibilities",
            duration_minutes: 14,
            has_quiz: true,
            content: `Cyber security is no longer an IT department concern — it is a strategic risk that sits squarely within governors' oversight responsibilities. Schools are increasingly targeted by cyber attackers because they hold valuable personal data, often have limited cyber security resource, and disruption to a school is particularly damaging to the community.\n\nDfE Cyber Security Standards: The Department for Education has published the Cyber Security Standards for Schools and Colleges. These set a baseline of security measures that all schools should implement. Governors should be aware of these standards and should receive assurance that the school meets them. Key standards include:\n• Multi-Factor Authentication (MFA) for all staff accessing school systems remotely\n• Regular, tested backups of critical data\n• Strong password policies and management\n• Up-to-date antivirus and device management\n• A documented cyber incident response plan\n\nWhat a cyber attack means for a school: The most common types of cyber attack affecting schools are:\n• Ransomware — malicious software that encrypts the school's data and demands payment for the decryption key. This can take down the entire school's IT systems, including MIS, email, and all stored files.\n• Phishing — fraudulent emails designed to steal login credentials or install malware. A staff member clicking a malicious link can compromise the entire school network.\n• Data exfiltration — attackers gaining access to personal data and threatening to publish it unless a ransom is paid.\n\nBusiness continuity: Governors should ensure the school has a business continuity plan that covers what happens if IT systems are taken offline by a cyber attack. Questions to ask:\n• How quickly could we restore critical systems from backup?\n• Are our backups stored offline (air-gapped) so ransomware cannot reach them?\n• Do we have a paper-based fallback for critical processes like registration and pupil contact?\n• Who is responsible for leading the school's response to a cyber incident?\n\nMFA and backup strategy: These are two of the most effective controls against cyber attacks. MFA means that even if a password is stolen, an attacker cannot access the account without the second factor (usually a phone or authenticator app). Regular, tested, offline backups mean that if ransomware strikes, the school can restore its data without paying a ransom.\n\nIncident response oversight: Governors should satisfy themselves that the school has a documented incident response plan and that it has been tested. When a cyber incident occurs, governors should be notified and should ensure the school follows its plan, reports to relevant authorities (the ICO if personal data is affected, the DfE, and the NCSC for serious incidents), and learns from the experience to prevent recurrence.`,
            quiz: [
              {
                question: "What is ransomware?",
                options: [
                  "A type of phishing email targeting school governors",
                  "Malicious software that encrypts school data and demands payment for the decryption key",
                  "A DfE regulation requiring schools to pay for cyber insurance",
                  "A security tool that prevents unauthorised access",
                ],
                correct_answer: 1,
                explanation:
                  "Ransomware encrypts a school's data and demands payment for the key to decrypt it. It can take down entire school IT systems.",
              },
              {
                question: "Why is it important that school backups are stored offline (air-gapped)?",
                options: [
                  "Online backups are slower to restore",
                  "Ransomware can encrypt online backups, leaving no clean version to restore from",
                  "Ofsted requires offline backups",
                  "Online backup providers are not GDPR-compliant",
                ],
                correct_answer: 1,
                explanation:
                  "If backups are connected to the same network, ransomware can encrypt them too. Offline (air-gapped) backups ensure a clean copy exists that attackers cannot reach.",
              },
              {
                question: "Multi-Factor Authentication (MFA) protects against which type of attack?",
                options: [
                  "Ransomware installing itself from a USB drive",
                  "Account compromise using a stolen password",
                  "Physical theft of school devices",
                  "DDoS attacks on the school website",
                ],
                correct_answer: 1,
                explanation:
                  "MFA means an attacker with a stolen password still cannot access the account without the second factor — it is one of the most effective defences against credential theft.",
              },
            ],
          },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Upsert function
// ─────────────────────────────────────────────────────────────────────────────

export async function seedCoursesToSupabase(supabase: SupabaseClient): Promise<void> {
  for (const course of SEED_COURSES) {
    const { sections, ...courseData } = course;

    // Upsert course — course IDs are valid hex UUIDs
    const { error: courseErr } = await supabase
      .from("training_courses")
      .upsert(
        {
          id: courseData.id,
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          level: courseData.level,
          duration_minutes: courseData.duration_minutes,
          thumbnail_color: courseData.thumbnail_color,
          status: "published",
        },
        { onConflict: "id" }
      );
    if (courseErr) throw new Error(`Course upsert failed (${courseData.title}): ${courseErr.message}`);

    // Skip sections/lessons if already seeded for this course (idempotent)
    const { data: existing } = await supabase
      .from("training_sections")
      .select("id")
      .eq("course_id", courseData.id)
      .limit(1);
    if (existing && existing.length > 0) continue;

    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
      const section = sections[sIdx];
      const { lessons } = section;

      // Insert section — let DB generate a valid UUID
      const { data: newSection, error: sectionErr } = await supabase
        .from("training_sections")
        .insert({ course_id: courseData.id, title: section.title, sort_order: sIdx })
        .select("id")
        .single();
      if (sectionErr) throw new Error(`Section insert failed (${section.title}): ${sectionErr.message}`);

      for (let lIdx = 0; lIdx < lessons.length; lIdx++) {
        const lesson = lessons[lIdx];
        const { quiz } = lesson;

        // Insert lesson — let DB generate a valid UUID
        const { data: newLesson, error: lessonErr } = await supabase
          .from("training_lessons")
          .insert({
            course_id: courseData.id,
            section_id: newSection!.id,
            title: lesson.title,
            content: lesson.content,
            duration_minutes: lesson.duration_minutes,
            has_quiz: lesson.has_quiz,
            sort_order: lIdx,
          })
          .select("id")
          .single();
        if (lessonErr) throw new Error(`Lesson insert failed (${lesson.title}): ${lessonErr.message}`);

        // Insert quiz questions in bulk
        if (quiz && quiz.length > 0) {
          const { error: quizErr } = await supabase
            .from("training_quizzes")
            .insert(
              quiz.map((q, qIdx) => ({
                lesson_id: newLesson!.id,
                question: q.question,
                options: q.options,
                correct_answer: q.correct_answer,
                explanation: q.explanation,
                sort_order: qIdx,
              }))
            );
          if (quizErr) throw new Error(`Quiz insert failed (${lesson.title}): ${quizErr.message}`);
        }
      }
    }
  }
}
