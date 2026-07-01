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

I request that this charge be cancelled. If rejected, please provide my POPLA/IAS verification code.` },
      { id: 'machine', label: 'The payment machine / app was broken',
        body: `I am writing to formally appeal Penalty/Parking Charge Notice {{pcnRef}}, issued on {{dateIssued}} at {{location}} in respect of vehicle {{vehicleReg}}.

I dispute this charge because the payment machine or payment app was out of order, would not accept payment, or offered no working method to pay at the time. {{detail}}

A motorist cannot fairly be penalised for failing to pay where the operator did not provide a working means of payment. I attempted to pay in good faith and was prevented from doing so by a fault outside my control.

I request that this charge be cancelled. If rejected, please issue a rejection notice with details of the independent appeals service.` },
      { id: 'deminimis', label: 'I only overstayed by a few minutes',
        body: `I am writing to formally appeal Parking Charge Notice {{pcnRef}}, issued on {{dateIssued}} at {{location}} in respect of vehicle {{vehicleReg}}.

The alleged overstay was only a few minutes. Time is needed to find a space, read the terms, pay and exit, and ANPR entry/exit times capture this manoeuvring time rather than actual parking time. {{detail}}

A charge for such a minor, de minimis overstay is disproportionate and does not reflect any genuine loss.

I request that this charge be cancelled. If rejected, please provide my POPLA/IAS appeal code.` },
      { id: 'notmyvehicle', label: 'Not my vehicle / sold / cloned plate',
        body: `I am writing regarding parking charge {{pcnRef}}, issued on {{dateIssued}} at {{location}} for vehicle {{vehicleReg}}.

I was not responsible for this vehicle at the relevant time: it had been sold / was not in my possession / my registration appears to have been cloned or misread. {{detail}}

I am therefore not liable, and I put the operator to strict proof of the driver/keeper's identity and of compliance with the Protection of Freedoms Act 2012 where keeper liability is alleged.

I request that this charge be cancelled and removed from my record. If rejected, please provide the evidence relied upon and the independent appeal route.` },
      { id: 'ntktime', label: 'Notice to Keeper arrived too late (private ticket)',
        body: `I am writing as registered keeper regarding parking charge {{pcnRef}}, issued on {{dateIssued}} at {{location}} for vehicle {{vehicleReg}}.

Where the operator relies on keeper liability under Schedule 4 of the Protection of Freedoms Act 2012, the Notice to Keeper must be served within the strict statutory time limits. The Notice here was not served within those limits. {{detail}}

As the POFA timing requirements have not been met, keeper liability does not arise and the charge is unenforceable against me.

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

I request the disputed amount be returned. If not agreed, I will refer this to the {{scheme}} ADR scheme.` },
      { id: 'cleaning', label: 'Unreasonable cleaning charge',
        body: `I am writing regarding the deposit of £{{depositAmount}} held for the tenancy at {{yourAddress}}, protected with {{scheme}}.

I dispute the proposed deductions: {{deductions}}.

A landlord cannot require a property to be returned in a better state than it was at check-in, and a tenant is only obliged to return it in a reasonably clean condition allowing for fair wear and tear. A blanket "professional cleaning" charge, with no evidence the property was professionally cleaned at the start, is not recoverable. {{detail}}

I request the disputed amount be returned. Failing agreement, I will escalate to the {{scheme}} ADR service.` },
      { id: 'unprotected', label: 'Deposit was not protected properly',
        body: `I am writing regarding the deposit of £{{depositAmount}} held for the tenancy at {{yourAddress}}.

I have reason to believe the deposit was not protected in a government-approved scheme within 30 days of payment, and/or the prescribed information was not provided to me as required by the Housing Act 2004. {{detail}}

Where a landlord fails to comply, the tenant may be entitled to the return of the deposit and to a statutory penalty of between one and three times the deposit amount, awarded by the court. Please confirm the scheme, date of protection, and provide the prescribed information, failing which I will pursue this claim.

I request the full return of my deposit. I reserve the right to bring a claim for the statutory penalty.` }
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
      { id: 'flightdenied', label: 'Denied boarding / bumped from flight (UK261)',
        body: `I am writing to claim compensation for being denied boarding on my {{operator}} flight on {{dateTravel}}, route {{route}}, booking reference {{ref}}.

I held a confirmed reservation and arrived at the gate in time. I was denied boarding against my will, likely due to overbooking. {{detail}}

Under UK Regulation 261 (retained EC261), a passenger who is denied boarding against their will is entitled to fixed compensation. For UK-departing flights the amounts are set in sterling:
- £220 (routes up to 1,500km)
- £350 (routes 1,500–3,500km)
- £520 (routes over 3,500km)
plus care (meals/refreshments) during the wait and, where applicable, hotel accommodation. (Flights covered by EU261 rather than UK261 are compensated in euros at €250 / €400 / €600.)

I request the compensation due under UK261, plus reimbursement of any out-of-pocket expenses, within 14 days. If you intend to decline, please state the specific legal grounds.` },
      { id: 'train', label: 'Train delay (Delay Repay)',
        body: `I am writing to claim compensation under the Delay Repay scheme for my {{operator}} journey on {{dateTravel}}, route {{route}}, ticket reference {{ref}}.

The journey was delayed by {{delayLength}}. Under Delay Repay, compensation is payable based on the length of delay, regardless of the cause. {{detail}}

I request the compensation due and confirmation of payment within the scheme's stated timescale. Please treat this as a formal Delay Repay claim.` }
    ]
  },

  parcel: {
    id: 'parcel',
    label: 'Lost or Damaged Parcel',
    tagline: 'Claim for a missing or damaged delivery',
    blurb: 'Parcel lost, damaged, or delivered to the wrong place? Make a formal claim against the retailer or courier.',
    fields: [
      { id: 'yourName', label: 'Your full name', type: 'text', required: true },
      { id: 'yourAddress', label: 'Your address', type: 'textarea', required: true },
      { id: 'recipient', label: 'Retailer or courier name', type: 'text', required: true },
      { id: 'orderRef', label: 'Order / tracking reference', type: 'text', required: true },
      { id: 'orderDate', label: 'Order / dispatch date', type: 'date', required: true },
      { id: 'itemDesc', label: 'What was in the parcel?', type: 'text', required: true },
      { id: 'value', label: 'Value of item(s) (£)', type: 'text', required: true },
      { id: 'detail', label: 'What happened (optional)', type: 'textarea', required: false }
    ],
    grounds: [
      { id: 'lost', label: 'Parcel never arrived',
        body: `Dear {{recipient}},

I am writing to make a formal claim in respect of order/tracking reference {{orderRef}}, placed on {{orderDate}}.

The parcel has not been delivered and I have received no notification of delivery or reason for non-delivery. The contents were: {{itemDesc}}, with a value of £{{value}}. {{detail}}

Under the Consumer Rights Act 2015, the retailer is responsible for ensuring goods are delivered. Risk remains with the seller until delivery is completed. Where a parcel is lost in transit, the seller — not the customer — must pursue the carrier.

I request that you either arrange immediate redelivery of the goods or provide a full refund of £{{value}} within 14 days. If I do not receive a satisfactory response, I will escalate to my card provider for a chargeback and/or to the relevant ADR scheme.` },
      { id: 'damaged', label: 'Item arrived damaged',
        body: `Dear {{recipient}},

I am writing regarding order/tracking reference {{orderRef}}, placed on {{orderDate}}.

The parcel was delivered but the item(s) arrived damaged. Contents: {{itemDesc}}, value £{{value}}. {{detail}}

Under the Consumer Rights Act 2015, goods must be of satisfactory quality and fit for purpose. Damage sustained in transit is the responsibility of the seller. I am entitled to a repair, replacement, or full refund.

Please arrange collection and replacement, or issue a full refund of £{{value}} within 14 days. Failing a satisfactory resolution, I will escalate to my card provider and the relevant ADR scheme.` },
      { id: 'wrongplace', label: 'Left in an unsafe place / wrong address',
        body: `Dear {{recipient}},

I am writing regarding order/tracking reference {{orderRef}}, placed on {{orderDate}}.

The carrier marked the parcel as delivered but it was left in an unsafe or unspecified location / at a wrong address, and I have not received it. Contents: {{itemDesc}}, value £{{value}}. {{detail}}

Delivery is not complete until the parcel is placed in my hands or at an agreed safe place. Where a carrier leaves a parcel insecurely and it is lost, the sender remains liable under the Consumer Rights Act 2015.

I request redelivery or a full refund of £{{value}} within 14 days, failing which I will pursue this via my card provider or through the courts if necessary.` }
    ]
  },

  counciltax: {
    id: 'counciltax',
    label: 'Council Tax Challenge',
    tagline: 'Challenge your banding or a council tax bill',
    blurb: 'Wrong council tax band, incorrect bill, or exemption refused? Appeal in writing.',
    fields: [
      { id: 'yourName', label: 'Your full name', type: 'text', required: true },
      { id: 'yourAddress', label: 'Property address', type: 'textarea', required: true },
      { id: 'council', label: 'Local council name', type: 'text', required: true },
      { id: 'accountRef', label: 'Council tax account reference', type: 'text', required: true },
      { id: 'currentBand', label: 'Current banding (A-H)', type: 'text', required: false },
      { id: 'detail', label: 'Details of your challenge (optional)', type: 'textarea', required: false }
    ],
    grounds: [
      { id: 'wrongband', label: 'Wrong council tax band',
        body: `Dear Council Tax Department,

I am writing to formally challenge the council tax banding of my property at {{yourAddress}}, account reference {{accountRef}}.

The property is currently in Band {{currentBand}}. I believe this is incorrect and that the property should be in a lower band. My reasons are: comparable properties on the same road and of the same type and size are banded lower; the valuation appears to have been carried out incorrectly or the property characteristics have changed since the 1991 valuation date. {{detail}}

I am requesting a formal review. If you are unable to correct this, I will refer the matter to the Valuation Office Agency (VOA) for an independent review of the banding.

Please acknowledge receipt and confirm next steps within 21 days.

Yours faithfully,
{{yourName}}
{{yourAddress}}` },
      { id: 'exempt', label: 'I am exempt or entitled to a discount',
        body: `Dear Council Tax Department,

I am writing regarding council tax account {{accountRef}} for {{yourAddress}}.

I am applying for an exemption or discount on the following grounds: {{detail}}

Common grounds include: single person discount (25%), student exemption, severe mental impairment, property uninhabited and requiring major repairs, or other statutory exemption.

Please review my account and apply the appropriate reduction from the current date. Please also confirm in writing whether any backdating applies.

Yours faithfully,
{{yourName}}
{{yourAddress}}` },
      { id: 'liability', label: 'I am not liable for this bill',
        body: `Dear Council Tax Department,

I am writing to dispute my liability for council tax on the property at {{yourAddress}}, account reference {{accountRef}}.

I do not believe I am the liable person for this bill. {{detail}}

Liability for council tax follows a strict hierarchy under the Local Government Finance Act 1992. I am asking you to review and correct the account accordingly. Please provide written confirmation of your decision within 21 days.

Yours faithfully,
{{yourName}}
{{yourAddress}}` }
    ]
  },

  energy: {
    id: 'energy',
    label: 'Energy Bill Dispute',
    tagline: 'Challenge an incorrect energy bill',
    blurb: 'Overcharged, wrong meter readings, or a disputed estimated bill? Write a formal dispute letter.',
    fields: [
      { id: 'yourName', label: 'Your full name', type: 'text', required: true },
      { id: 'yourAddress', label: 'Your address', type: 'textarea', required: true },
      { id: 'supplier', label: 'Energy supplier name', type: 'text', required: true },
      { id: 'accountRef', label: 'Account number', type: 'text', required: true },
      { id: 'disputedAmount', label: 'Amount in dispute (£)', type: 'text', required: true },
      { id: 'detail', label: 'Details of the dispute (optional)', type: 'textarea', required: false }
    ],
    grounds: [
      { id: 'estimated', label: 'Bill based on estimates — actual readings are lower',
        body: `Dear {{supplier}} Customer Services,

I am writing to formally dispute a bill on my account (reference: {{accountRef}}) for {{yourAddress}}.

The disputed amount is £{{disputedAmount}}. I believe this bill is based on estimated meter readings that significantly overstate my actual usage. {{detail}}

Under Ofgem's Licence Conditions and the Energy Supply Standard Conditions, my supplier must use actual meter readings when available and must correct any billing errors. I am providing my actual meter reading(s) and requesting that the bill be recalculated accordingly.

Please amend the bill using actual readings, issue a corrected statement, and — if a credit has arisen — refund or credit the overpaid amount within 14 days.

If this matter is not resolved to my satisfaction, I will refer it to the Energy Ombudsman.

Yours sincerely,
{{yourName}}
{{yourAddress}}` },
      { id: 'backbill', label: 'Backdated bill (back-billing rule)',
        body: `Dear {{supplier}} Customer Services,

I am writing to dispute a backdated charge on account {{accountRef}} for {{yourAddress}}.

The disputed amount is £{{disputedAmount}}. {{detail}}

Under Ofgem's back-billing rules, energy suppliers cannot charge domestic customers for energy used more than 12 months before the date of the bill, where the error was not the customer's fault. I did not receive correct bills for the period in question and was not aware of the undercharge.

I request that all charges older than 12 months be written off and the bill be corrected accordingly. Please confirm your position within 8 weeks, after which I will refer this to the Energy Ombudsman if unresolved.

Yours sincerely,
{{yourName}}
{{yourAddress}}` },
      { id: 'wrongrate', label: 'Wrong tariff or rate applied',
        body: `Dear {{supplier}} Customer Services,

I am writing to dispute the rate applied to my energy account (reference: {{accountRef}}) at {{yourAddress}}.

The disputed amount is £{{disputedAmount}}. I believe an incorrect tariff, unit rate, or standing charge has been applied to my account. {{detail}}

I request a full account review, correction of the tariff to the correct rate, and a recalculated statement. If any overpayment has been made, please refund or credit it within 14 days.

Failing resolution, I will refer this matter to the Energy Ombudsman.

Yours sincerely,
{{yourName}}
{{yourAddress}}` }
    ]
  },

  holiday: {
    id: 'holiday',
    label: 'Holiday Complaint',
    tagline: 'Complain about a package holiday or booking',
    blurb: 'Hotel not as described, flights cancelled, or holiday rep let you down? Make a formal complaint.',
    fields: [
      { id: 'yourName', label: 'Your full name', type: 'text', required: true },
      { id: 'yourAddress', label: 'Your address', type: 'textarea', required: true },
      { id: 'operator', label: 'Tour operator / travel company name', type: 'text', required: true },
      { id: 'bookingRef', label: 'Booking reference', type: 'text', required: true },
      { id: 'travelDate', label: 'Date of travel', type: 'date', required: true },
      { id: 'destination', label: 'Destination', type: 'text', required: true },
      { id: 'amountSought', label: 'Compensation amount you are seeking (£)', type: 'text', required: true },
      { id: 'detail', label: 'What went wrong (optional)', type: 'textarea', required: false }
    ],
    grounds: [
      { id: 'notasdescribed', label: 'Holiday / hotel not as described',
        body: `Dear {{operator}} Customer Relations,

I am writing to formally complain about my holiday (booking reference: {{bookingRef}}, destination: {{destination}}, travel date: {{travelDate}}).

The holiday / accommodation was not as described in your brochure or website. {{detail}}

Under the Package Travel and Linked Travel Arrangements Regulations 2018, package holiday operators are responsible for the proper performance of all travel services included in the package. Where the package is not provided in conformity with the contract, the consumer is entitled to an appropriate price reduction or compensation, depending on the degree of non-conformity.

I am seeking compensation of £{{amountSought}} in respect of the shortfall from what was contracted. Please respond within 28 days. If this cannot be resolved directly, I will refer this matter to ABTA (or ATOL where applicable) for arbitration.

Yours sincerely,
{{yourName}}
{{yourAddress}}` },
      { id: 'cancelled', label: 'Holiday / flight cancelled with no adequate replacement',
        body: `Dear {{operator}} Customer Relations,

I am writing regarding the cancellation of my booking (reference: {{bookingRef}}, destination: {{destination}}, travel date: {{travelDate}}).

My booking was cancelled and the alternative offered was not acceptable / no adequate alternative was offered. {{detail}}

Under the Package Travel Regulations 2018, where a package is cancelled before departure, the organiser must offer a full refund or an alternative package of at least equivalent quality. I am entitled to appropriate compensation for any significant inconvenience caused by the cancellation.

I am seeking a full refund and compensation of £{{amountSought}}. Please respond within 28 days, failing which I will refer this to ABTA/ATOL and, if necessary, pursue a county court claim.

Yours sincerely,
{{yourName}}
{{yourAddress}}` },
      { id: 'illness', label: 'Illness / injury caused by conditions at the holiday',
        body: `Dear {{operator}} Customer Relations,

I am writing to formally complain about my holiday (booking reference: {{bookingRef}}, destination: {{destination}}, travel date: {{travelDate}}).

During the holiday I suffered illness or injury as a result of conditions at the accommodation or resort. {{detail}}

As the package organiser, you are liable under the Package Travel and Linked Travel Arrangements Regulations 2018 for losses caused by non-performance or improper performance of the contract, including personal injury resulting from negligence.

I am seeking compensation of £{{amountSought}} to cover medical costs, loss of enjoyment, and any other losses. I have retained all receipts and supporting evidence. Please respond within 28 days. If we cannot reach a settlement, I will refer this matter to ABTA and seek independent legal advice.

Yours sincerely,
{{yourName}}
{{yourAddress}}` }
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

export const TOOL_ORDER = ['parking', 'deposit', 'delay', 'lba', 'parcel', 'counciltax', 'energy', 'holiday'];
