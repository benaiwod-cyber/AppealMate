// AppealMate template library.
// Each tool has: id, label, blurb, the form fields it collects, and a set of
// "grounds" (reasons to appeal). Each ground carries a letter body template
// with {{placeholders}} that map to field ids (plus a few computed ones).
//
// Letters are TEMPLATES, not AI output: deterministic, free to generate, and
// legally safer than free-form generation. The library is the moat — grow it.

export const TOOLS = {
  parking: {
    id: 'parking',
    label: 'Parking Ticket / PCN Appeal',
    tagline: 'Appeal a parking charge',
    hero: true,
    blurb: 'Council PCN or a private parking charge — pick your ground and get a formal appeal letter in 2 minutes.',
    fields: [
      { id: 'yourName', label: 'Your full name', type: 'text', required: true },
      { id: 'yourAddress', label: 'Your address', type: 'textarea', required: true },
      { id: 'issuer', label: 'Who issued it?', type: 'select', required: true,
        options: ['A private parking company', 'The council'] },
      { id: 'operator', label: 'Parking company / council name', type: 'text', required: true },
      { id: 'pcnRef', label: 'PCN / charge reference number', type: 'text', required: true },
      { id: 'vehicleReg', label: 'Vehicle registration', type: 'text', required: true },
      { id: 'dateIssued', label: 'Date of the ticket', type: 'date', required: true },
      { id: 'location', label: 'Location (car park / street)', type: 'text', required: true },
      { id: 'detail', label: 'Anything specific about what happened (optional)', type: 'textarea', required: false }
    ],
    grounds: [
      { id: 'signage', label: 'Signs were unclear, missing, or hidden',
        body: `I am writing to formally appeal Penalty/Parking Charge Notice {{pcnRef}}, issued on {{dateIssued}} at {{location}} in respect of vehicle {{vehicleReg}}.

I dispute this charge on the grounds that the signage at the site was inadequate to form a contract or to give clear notice of the parking terms. The signs were unclear, poorly positioned, obscured, or too small to read in the conditions at the time. {{detail}}

For a private parking charge, the operator must show that clear and prominent terms were brought to the driver's attention (Parking Eye v Beavis [2015] UKSC 67). Where signage fails this test, no contract is formed and the charge is not enforceable. For a council PCN, inadequate signing of the restriction is grounds for cancellation.

I therefore request that this charge be cancelled. If you reject this appeal, please issue a rejection notice setting out my right to escalate to the independent appeals service (POPLA or the IAS for private operators, or the Traffic Penalty Tribunal / London Tribunals for councils).` },
      { id: 'grace', label: 'I was within the grace period',
        body: `I am writing to formally appeal Parking Charge Notice {{pcnRef}}, issued on {{dateIssued}} at {{location}} in respect of vehicle {{vehicleReg}}.

I dispute this charge because the vehicle was within the permitted grace period. The British Parking Association and IPC Codes of Practice require operators to allow a minimum consideration period on entry and a grace period of at least 10 minutes before enforcement after a permitted parking period ends. {{detail}}

The time recorded does not account for this mandatory grace period, and on a correct calculation no enforceable overstay occurred.

I request that this charge be cancelled. If rejected, please provide a rejection notice with my POPLA/IAS appeal code.` },
      { id: 'paid', label: 'I had already paid / had a valid ticket',
        body: `I am writing to formally appeal Penalty/Parking Charge Notice {{pcnRef}}, issued on {{dateIssued}} at {{location}} in respect of vehicle {{vehicleReg}}.

I dispute this charge because valid payment for parking was made / a valid ticket or session was in place at the time. {{detail}}

A charge issued despite valid payment is not enforceable; a minor keying error in a registration or a payment-system delay is not a breach justifying a penalty. I can provide proof of payment on request.

I request that this charge be cancelled in full. If rejected, please issue a formal rejection notice with details of the independent appeal route.` },
      { id: 'permit', label: 'I had a valid permit / blue badge',
        body: `I am writing to formally appeal Penalty/Parking Charge Notice {{pcnRef}}, issued on {{dateIssued}} at {{location}} in respect of vehicle {{vehicleReg}}.

I dispute this charge because a valid permit / Blue Badge was displayed or registered for this vehicle and location at the time. {{detail}}

The vehicle was entitled to park and no breach of the terms occurred. I can provide a copy of the permit/badge on request.

I request that this charge be cancelled. If rejected, please provide a rejection notice and my independent appeal reference.` },
      { id: 'loading', label: 'I was loading / unloading or dropping off',
        body: `I am writing to formally appeal Penalty Charge Notice {{pcnRef}}, issued on {{dateIssued}} at {{location}} in respect of vehicle {{vehicleReg}}.

I dispute this charge because the vehicle was actively loading or unloading / setting down or picking up passengers, which is a permitted activity at this location. {{detail}}

The stop was for that purpose only and the vehicle was attended throughout. This does not constitute an enforceable parking contravention.

I request that this charge be cancelled. If rejected, please issue a rejection notice setting out my right to appeal to the independent tribunal.` },
      { id: 'mitigating', label: 'Mitigating circumstances (breakdown, emergency, medical)',
        body: `I am writing to formally appeal Penalty/Parking Charge Notice {{pcnRef}}, issued on {{dateIssued}} at {{location}} in respect of vehicle {{vehicleReg}}.

I ask you to exercise discretion and cancel this charge on the grounds of mitigating circumstances. {{detail}}

The circumstances were genuine and outside my control, and I acted reasonably throughout. I can provide supporting evidence on request.

I request that this charge be cancelled. If you are unable to do so, please issue a formal rejection notice with details of the independent appeals service so I may escalate.` },
      { id: 'notdriver', label: 'Keeper appeal — I was not the driver (private ticket)',
        body: `I am writing as the registered keeper in respect of parking charge {{pcnRef}}, issued on {{dateIssued}} at {{location}} for vehicle {{vehicleReg}}.

I was not the driver at the relevant time and I am not obliged to name them. I put the operator to strict proof that the requirements of Schedule 4 of the Protection of Freedoms Act 2012 ("POFA") have been met in full, including the form, wording and timing of the Notice to Keeper. {{detail}}

Unless the operator can demonstrate strict compliance with POFA, keeper liability does not transfer and the charge is unenforceable against me.

I request that this charge be cancelled. If rejected, please provide my POPLA/IAS verification code.` }
    ]
  },

  deposit: {
    id: 'deposit',
    label: 'Tenancy Deposit Dispute',
    tagline: 'Challenge unfair deposit deductions',
    blurb: 'Get back deductions you do not owe. Average disputed deposit is around £355.',
    fields: [
      { id: 'yourName', label: 'Your full name', type: 'text', required: true },
      { id: 'yourAddress', label: 'The rented property address', type: 'textarea', required: true },
      { id: 'landlord', label: 'Landlord / letting agent name', type: 'text', required: true },
      { id: 'scheme', label: 'Deposit scheme', type: 'select', required: true,
        options: ['TDS', 'DPS', 'MyDeposits', 'Not sure'] },
      { id: 'depositAmount', label: 'Deposit amount (£)', type: 'text', required: true },
      { id: 'deductions', label: 'What are they trying to deduct, and how much?', type: 'textarea', required: true },
      { id: 'detail', label: 'Why the deduction is unfair (optional)', type: 'textarea', required: false }
    ],
    grounds: [
      { id: 'betterment', label: 'Betterment — they want new-for-old',
        body: `I am writing regarding the deposit of £{{depositAmount}} held for the tenancy at {{yourAddress}}, protected with {{scheme}}.

I dispute the proposed deductions: {{deductions}}.

The deductions claim the cost of replacing items new-for-old. This is "betterment": a landlord cannot profit from a deposit and must account for the age, condition and reasonable lifespan of any item. Only the depreciated value, not full replacement cost, can fairly be claimed. {{detail}}

I do not agree to these deductions and request the disputed amount be returned. If we cannot resolve this, I will refer the matter to the scheme's free Alternative Dispute Resolution (ADR) service, where the burden of proof is on the landlord.` },
      { id: 'fairwear', label: 'Fair wear and tear',
        body: `I am writing regarding the deposit of £{{depositAmount}} held for the tenancy at {{yourAddress}}, protected with {{scheme}}.

I dispute the proposed deductions: {{deductions}}.

These relate to fair wear and tear, for which a tenant is not liable. Reasonable deterioration from ordinary use over the length of the tenancy cannot be charged for. {{detail}}

I request the disputed amount be returned in full. Failing agreement, I will escalate to the {{scheme}} ADR service for an independent adjudication.` },
      { id: 'noevidence', label: 'No check-in inventory / no evidence',
        body: `I am writing regarding the deposit of £{{depositAmount}} held for the tenancy at {{yourAddress}}, protected with {{scheme}}.

I dispute the proposed deductions: {{deductions}}.

The landlord/agent has not produced a signed check-in inventory or dated evidence of the property's condition at the start of the tenancy. Without a clear baseline, deductions for alleged damage cannot be substantiated, and the burden of proof in ADR rests with the landlord. {{detail}}

I request the disputed amount be returned. If not agreed, I will refer this to the {{scheme}} ADR scheme.` }
    ]
  },

  delay: {
    id: 'delay',
    label: 'Train & Flight Delay Claim',
    tagline: "Claim compensation you're owed",
    blurb: 'Delayed train or flight? Generate a compensation claim under Delay Repay or UK261.',
    fields: [
      { id: 'yourName', label: 'Your full name', type: 'text', required: true },
      { id: 'mode', label: 'Train or flight?', type: 'select', required: true, options: ['Flight', 'Train'] },
      { id: 'operator', label: 'Airline / train operator', type: 'text', required: true },
      { id: 'ref', label: 'Booking / ticket reference', type: 'text', required: true },
      { id: 'dateTravel', label: 'Date of travel', type: 'date', required: true },
      { id: 'route', label: 'Route (from → to)', type: 'text', required: true },
      { id: 'delayLength', label: 'How long was the delay?', type: 'text', required: true },
      { id: 'detail', label: 'Any extra detail (optional)', type: 'textarea', required: false }
    ],
    grounds: [
      { id: 'flight', label: 'Flight delay / cancellation (UK261)',
        body: `I am writing to claim compensation for the disruption to my {{operator}} flight on {{dateTravel}}, route {{route}}, booking reference {{ref}}.

The flight was delayed/cancelled by {{delayLength}}. Under UK Regulation 261 (retained EC261), passengers are entitled to fixed compensation where the delay at the final destination is 3 hours or more and the cause was within the airline's control. {{detail}}

I request payment of the compensation due under UK261. Please confirm the amount and payment timescale within 14 days. If the claim is rejected on "extraordinary circumstances" grounds, please provide the specific evidence, failing which I will escalate to the CAA / an ADR scheme.` },
      { id: 'train', label: 'Train delay (Delay Repay)',
        body: `I am writing to claim compensation under the Delay Repay scheme for my {{operator}} journey on {{dateTravel}}, route {{route}}, ticket reference {{ref}}.

The journey was delayed by {{delayLength}}. Under Delay Repay, compensation is payable based on the length of delay, regardless of the cause. {{detail}}

I request the compensation due and confirmation of payment within the scheme's stated timescale. Please treat this as a formal Delay Repay claim.` }
    ]
  },

  lba: {
    id: 'lba',
    label: 'Letter Before Action',
    tagline: 'Send a formal pre-court demand',
    blurb: 'Owed money? A Letter Before Action is the formal step before small claims court.',
    fields: [
      { id: 'yourName', label: 'Your full name', type: 'text', required: true },
      { id: 'yourAddress', label: 'Your address', type: 'textarea', required: true },
      { id: 'recipient', label: 'Who owes you (name)?', type: 'text', required: true },
      { id: 'recipientAddress', label: 'Their address', type: 'textarea', required: true },
      { id: 'amount', label: 'Amount owed (£)', type: 'text', required: true },
      { id: 'reason', label: 'What is the money for?', type: 'textarea', required: true },
      { id: 'deadlineDays', label: 'Days to pay before you act', type: 'text', required: true },
      { id: 'detail', label: 'Any extra detail (optional)', type: 'textarea', required: false }
    ],
    grounds: [
      { id: 'standard', label: 'Standard demand for payment',
        body: `Dear {{recipient}},

LETTER BEFORE ACTION

I am writing regarding the sum of £{{amount}} which you owe me in respect of: {{reason}}. {{detail}}

Despite my previous requests this amount remains unpaid. This letter is formal notice, in accordance with the Pre-Action Protocol for Debt Claims, that unless payment of £{{amount}} is received within {{deadlineDays}} days of the date of this letter, I intend to issue proceedings in the County Court to recover the debt without further notice. Such proceedings may add court fees, interest and costs to the amount you owe.

I would prefer to resolve this without court action. Please contact me to arrange payment.

Yours faithfully,
{{yourName}}
{{yourAddress}}` }
    ]
  }
};

export const TOOL_ORDER = ['parking', 'deposit', 'delay', 'lba'];
