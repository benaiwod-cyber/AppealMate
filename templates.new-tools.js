// AppealMate — DROP-IN new tools (Parcel, Council Tax, Energy/Broadband, Holiday)
// + the EU261 ground to add to the existing `delay` tool.
//
// Review the wording, then merge each object into public/templates.js TOOLS and
// extend TOOL_ORDER. These match the existing voice: identify the matter + facts,
// state the ground citing the law, request the remedy, name the escalation route.
//
// Deploy is blocked until ~2026-06-29 (Netlify cap) — build/batch now, deploy later.

export const NEW_TOOLS = {

  parcel: {
    id: 'parcel',
    label: 'Parcel / Delivery Complaint',
    tagline: 'Damaged or missing delivery? Claim from the retailer',
    blurb: 'A parcel arrived damaged or never came? The retailer is responsible, not the courier. Get a formal complaint letter under the Consumer Rights Act 2015.',
    fields: [
      { id: 'yourName', label: 'Your full name', type: 'text', required: true },
      { id: 'yourAddress', label: 'Your address', type: 'textarea', required: true },
      { id: 'retailer', label: 'Retailer / seller name', type: 'text', required: true },
      { id: 'orderRef', label: 'Order number / reference', type: 'text', required: true },
      { id: 'orderDate', label: 'Date of order', type: 'date', required: true },
      { id: 'itemValue', label: 'Value of the goods (£)', type: 'text', required: true },
      { id: 'detail', label: 'What went wrong (optional)', type: 'textarea', required: false }
    ],
    grounds: [
      { id: 'damaged', label: 'The item arrived damaged',
        body: `I am writing regarding order {{orderRef}}, placed with you on {{orderDate}}, value £{{itemValue}}.

The goods arrived damaged. Under the Consumer Rights Act 2015 goods must be of satisfactory quality (section 9), and the trader bears the risk for goods until they are delivered to the consumer (section 29). The goods were not of satisfactory quality on delivery. {{detail}}

My contract is with you as the retailer, not the courier. I therefore require a full refund or a replacement at no cost to me. Please confirm within 14 days how you will put this right.

If this is not resolved I will escalate through the retailer's complaints process and, where applicable, to the relevant alternative dispute resolution scheme, and I reserve the right to pursue the matter further.

Yours faithfully,
{{yourName}}
{{yourAddress}}` },
      { id: 'notdelivered', label: 'The order never arrived',
        body: `I am writing regarding order {{orderRef}}, placed with you on {{orderDate}}, value £{{itemValue}}.

The goods have not been delivered. Under section 28 of the Consumer Rights Act 2015, where goods are not delivered within the agreed time or within a reasonable time, I am entitled to treat the contract as at an end and to a full refund. {{detail}}

The contract is with you as the retailer; responsibility for non-delivery rests with you and not with me or the carrier. I require a full refund of £{{itemValue}} (or redelivery, at my election) within 14 days.

If this is not resolved I will escalate the complaint and reserve the right to pursue recovery of the sum due.

Yours faithfully,
{{yourName}}
{{yourAddress}}` },
      { id: 'retailer-liable', label: 'They told me to chase the courier',
        body: `I am writing regarding order {{orderRef}}, placed with you on {{orderDate}}, value £{{itemValue}}.

You have directed me to take up the problem with the courier. That is not correct in law. My contract is with you as the retailer. Under the Consumer Rights Act 2015 the trader is responsible for the goods until they are delivered to the consumer (section 29), and it is for you, not me, to resolve any failure by your chosen carrier. {{detail}}

I therefore require you to provide a full refund or replacement directly, and not to pass me to the courier. Please confirm within 14 days.

If this is not resolved I will escalate the complaint and reserve my right to pursue the matter further.

Yours faithfully,
{{yourName}}
{{yourAddress}}` }
    ]
  },

  counciltax: {
    id: 'counciltax',
    label: 'Council Tax Challenge',
    tagline: 'Challenge your band or claim a discount',
    blurb: 'Think your council tax band is wrong, or owed a single-person discount or exemption? Generate the formal letter. A band reduction can save £200–£500 a year.',
    fields: [
      { id: 'yourName', label: 'Your full name', type: 'text', required: true },
      { id: 'yourAddress', label: 'Property address', type: 'textarea', required: true },
      { id: 'council', label: 'Council name', type: 'text', required: true },
      { id: 'accountRef', label: 'Council tax account / reference (optional)', type: 'text', required: false },
      { id: 'currentBand', label: 'Current council tax band', type: 'select', required: true,
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'Not sure'] },
      { id: 'detail', label: 'Extra detail (optional)', type: 'textarea', required: false }
    ],
    grounds: [
      { id: 'band-comparables', label: 'My band is too high vs similar properties',
        body: `To the Valuation Office Agency,

I am writing to make a formal proposal to alter the Council Tax band for the property at {{yourAddress}}, currently shown in band {{currentBand}}.

I believe the band is too high. Comparable neighbouring properties of similar size, type and age are in a lower band, which indicates this property has been incorrectly assessed against its 1991 value. {{detail}}

I request that you review the banding and reduce it to reflect the correct valuation. Please confirm the outcome and, if you do not alter the list, set out my right to appeal to the Valuation Tribunal.

Yours faithfully,
{{yourName}}` },
      { id: 'band-change', label: 'The property or area has materially changed',
        body: `To the Valuation Office Agency,

I am writing regarding the Council Tax band for {{yourAddress}}, currently band {{currentBand}}.

There has been a material change relevant to the banding (for example, part of the property has been demolished or adapted, or the character of the local area has changed). The current band no longer reflects the property as it stands. {{detail}}

I request a review and reduction of the band. Please confirm the outcome and my onward right of appeal to the Valuation Tribunal if you decline to alter the list.

Yours faithfully,
{{yourName}}` },
      { id: 'spd', label: 'Single person discount (apply or restore wrongly removed 25%)',
        body: `To {{council}} Council Tax department,

Account reference: {{accountRef}}
Property: {{yourAddress}}

I am writing to claim the single person discount of 25% on my Council Tax. I am the only adult (aged 18 or over) resident at this property and am therefore entitled to the discount under the Local Government Finance Act 1992. {{detail}}

If the discount was previously applied and has been removed, I ask that you reinstate it and refund any overpayment. Please confirm the discount and the corrected balance.

Yours faithfully,
{{yourName}}` },
      { id: 'disabled', label: 'Disabled band reduction',
        body: `To {{council}} Council Tax department,

Account reference: {{accountRef}}
Property: {{yourAddress}}

I am applying for the Disabled Band Reduction scheme. The property has a feature essential or of major importance to a disabled resident (for example, a room used to meet their needs, an additional bathroom or kitchen, or space to use a wheelchair indoors). Under the scheme the property should be charged at one band lower than its current band {{currentBand}} (or a reduction equivalent to band A where already in band A). {{detail}}

Please apply the reduction and confirm the corrected band and balance, refunding any overpayment.

Yours faithfully,
{{yourName}}` },
      { id: 'exemption', label: 'Exemption (student / empty / deceased estate)',
        body: `To {{council}} Council Tax department,

Account reference: {{accountRef}}
Property: {{yourAddress}}

I am writing to claim a Council Tax exemption for this property. The property qualifies for exemption (for example: occupied only by full-time students; left empty in defined circumstances; or an estate of a person who has died — Class F). {{detail}}

Please apply the appropriate exemption, confirm the period it covers, and refund any sum overpaid.

Yours faithfully,
{{yourName}}` }
    ]
  },

  energy: {
    id: 'energy',
    label: 'Energy / Broadband Bill Complaint',
    tagline: 'Dispute a bill and escalate to the Ombudsman',
    blurb: 'Wrong energy or broadband bill? Generate a formal complaint, and an Ombudsman escalation letter if it is still unresolved after 8 weeks.',
    fields: [
      { id: 'yourName', label: 'Your full name', type: 'text', required: true },
      { id: 'yourAddress', label: 'Your address', type: 'textarea', required: true },
      { id: 'provider', label: 'Provider name', type: 'text', required: true },
      { id: 'serviceType', label: 'Service', type: 'select', required: true,
        options: ['Energy', 'Broadband / mobile'] },
      { id: 'accountRef', label: 'Account number (optional)', type: 'text', required: false },
      { id: 'issue', label: 'What is the billing problem?', type: 'textarea', required: true },
      { id: 'weeksUnresolved', label: 'Weeks unresolved so far (optional)', type: 'text', required: false },
      { id: 'detail', label: 'Extra detail (optional)', type: 'textarea', required: false }
    ],
    grounds: [
      { id: 'backbilling', label: 'Back-billing: charged for old energy (over 12 months)',
        body: `To {{provider}}, complaints department.

Account: {{accountRef}}
Customer: {{yourName}}, {{yourAddress}}

I am writing to formally complain about my bill. You are seeking to charge me for energy used more than 12 months ago. {{issue}} {{detail}}

Under Ofgem's back-billing rules, a supplier cannot recover charges for energy used more than 12 months before the error was identified, where the customer was not previously billed correctly through no fault of their own. I do not accept the back-dated charges and require the bill to be corrected.

Please correct the account and confirm the revised balance within your published complaints timescale. If this is not resolved within 8 weeks, or you issue a deadlock letter, I will refer the complaint to the Energy Ombudsman, whose decision is binding on you.

Yours faithfully,
{{yourName}}` },
      { id: 'disputed-usage', label: 'Estimated / disputed bill — I have actual readings',
        body: `To {{provider}}, complaints department.

Account: {{accountRef}}
Customer: {{yourName}}, {{yourAddress}}

I am writing to dispute my bill, which is based on estimated or incorrect usage. {{issue}} I have provided actual meter readings / evidence of true usage and the bill does not reflect them. {{detail}}

Please re-bill the account on the basis of accurate readings and confirm the corrected balance. If this is not resolved within 8 weeks or you issue a deadlock letter, I will escalate to the relevant Ombudsman (Energy Ombudsman, or the Communications Ombudsman for broadband/mobile).

Yours faithfully,
{{yourName}}` },
      { id: 'price-rise', label: 'Mid-contract price rise / right to exit',
        body: `To {{provider}}, complaints department.

Account: {{accountRef}}
Customer: {{yourName}}, {{yourAddress}}

I am writing about a mid-contract price increase. {{issue}} Where a provider increases prices during a fixed-term contract other than as clearly permitted by the agreed terms, I am entitled to challenge the increase and, where applicable, to exit the contract without penalty. {{detail}}

Please confirm the basis for the increase and my right to exit penalty-free, or reverse it. If unresolved within 8 weeks or on a deadlock letter, I will refer the matter to the relevant Ombudsman.

Yours faithfully,
{{yourName}}` },
      { id: 'final-bill', label: 'Disputed final bill / exit fees after switching',
        body: `To {{provider}}, complaints department.

Account: {{accountRef}}
Customer: {{yourName}}, {{yourAddress}}

I am writing to dispute my final bill following my switch away from you. {{issue}} The closing balance and/or exit fees are not correct. {{detail}}

Please review and correct the final bill and confirm the true balance. If this is not resolved within 8 weeks or you issue a deadlock letter, I will refer the complaint to the relevant Ombudsman.

Yours faithfully,
{{yourName}}` },
      { id: 'adr-escalation', label: 'Escalate to the Ombudsman (8-week deadlock)',
        body: `To the Ombudsman (Energy Ombudsman for energy; Communications Ombudsman for broadband/mobile).

I wish to refer an unresolved complaint about {{provider}} (account {{accountRef}}).

Customer: {{yourName}}, {{yourAddress}}
Nature of complaint: {{issue}}
Time elapsed: approximately {{weeksUnresolved}} weeks since I first complained. {{detail}}

The provider has either failed to resolve the complaint within 8 weeks or has issued a deadlock letter. I ask the Ombudsman to investigate and to direct an appropriate remedy, including correction of the account and any compensation due. I confirm the complaint remains unresolved to my satisfaction.

Yours faithfully,
{{yourName}}` }
    ]
  },

  holiday: {
    id: 'holiday',
    label: 'Holiday / Package Complaint',
    tagline: 'Claim for a holiday that went wrong',
    blurb: 'Package holiday not as sold, or operator refusing a refund? Generate a formal complaint under the Package Travel Regulations 2018, and an ABTA/ATOL escalation if needed.',
    fields: [
      { id: 'yourName', label: 'Your full name', type: 'text', required: true },
      { id: 'yourAddress', label: 'Your address', type: 'textarea', required: true },
      { id: 'operator', label: 'Tour operator / travel company', type: 'text', required: true },
      { id: 'bookingRef', label: 'Booking reference', type: 'text', required: true },
      { id: 'travelDate', label: 'Departure date', type: 'date', required: true },
      { id: 'problem', label: 'What went wrong?', type: 'textarea', required: true },
      { id: 'detail', label: 'Extra detail (optional)', type: 'textarea', required: false }
    ],
    grounds: [
      { id: 'pre-change', label: 'Significant change before departure',
        body: `To {{operator}}, customer relations.

Booking reference: {{bookingRef}}, departure {{travelDate}}.

I am writing to complain about a significant change you made to my package before departure. {{problem}} {{detail}}

Under the Package Travel and Linked Travel Arrangements Regulations 2018, where the organiser significantly alters a main characteristic of the package, the traveller is entitled to accept a substitute, accept the change, or terminate the contract and receive a full refund. I do not accept the change and require a full refund / a comparable alternative at no extra cost.

Please confirm your response within 14 days. If unresolved, I will escalate to ABTA / the ATOL scheme and reserve my right to pursue the matter further.

Yours faithfully,
{{yourName}}
{{yourAddress}}` },
      { id: 'nonperformance', label: 'Downgrade / missing facilities during the holiday',
        body: `To {{operator}}, customer relations.

Booking reference: {{bookingRef}}, departure {{travelDate}}.

I am writing to complain that the holiday provided was not what was sold. {{problem}} Accommodation was downgraded / facilities or excursions were missing or not as described. {{detail}}

Under the Package Travel Regulations 2018 the organiser is responsible for the proper performance of the travel services in the package and must remedy any lack of conformity. I am entitled to an appropriate price reduction and compensation for the lack of conformity.

Please confirm your offer of redress within 14 days. If unresolved, I will escalate to ABTA / ATOL and reserve my right to pursue the matter further.

Yours faithfully,
{{yourName}}
{{yourAddress}}` },
      { id: 'illness', label: 'Holiday illness / food poisoning',
        body: `To {{operator}}, customer relations.

Booking reference: {{bookingRef}}, departure {{travelDate}}.

I am writing regarding illness suffered during my package holiday. {{problem}} {{detail}}

Under the Package Travel Regulations 2018 the organiser is liable for the proper performance of the package, including the standard of accommodation and catering. Where illness results from a failure to meet reasonable standards of hygiene and safety, I am entitled to compensation.

Please confirm how you will deal with this within 14 days. If unresolved, I will escalate to ABTA / ATOL and reserve my right to pursue a claim.

Yours faithfully,
{{yourName}}
{{yourAddress}}` },
      { id: 'insolvency', label: 'Operator went bust — protection claim',
        body: `To the relevant protection scheme (ATOL / ABTA).

I am making a claim in respect of a package booked with {{operator}} (booking reference {{bookingRef}}, departure {{travelDate}}), following the company's insolvency. {{problem}} {{detail}}

The package was financially protected. I claim a refund of money paid / the cost of repatriation as applicable under the scheme. Please confirm the process and the documents required.

Yours faithfully,
{{yourName}}
{{yourAddress}}` },
      { id: 'abta-escalation', label: 'Escalate to ABTA / ATOL (28-day deadlock)',
        body: `To ABTA / the ATOL scheme.

I wish to escalate an unresolved complaint about {{operator}} (booking reference {{bookingRef}}, departure {{travelDate}}).

Nature of complaint: {{problem}} {{detail}}

I raised this with the operator and it has not been resolved satisfactorily. I ask you to consider the complaint under your arbitration / dispute resolution scheme and to direct an appropriate remedy.

Yours faithfully,
{{yourName}}
{{yourAddress}}` }
    ]
  }

};

// ---- Add this ground to the EXISTING delay tool's grounds array ----
// Also update delay.blurb to mention EU261.
export const DELAY_EU_GROUND = {
  id: 'flight-eu',
  label: 'Flight delay / cancellation (EU261 — flight from the EU)',
  body: `I am writing to claim compensation for the disruption to my {{operator}} flight on {{dateTravel}}, route {{route}}, booking reference {{ref}}.

The flight departed from an EU airport and was delayed/cancelled by {{delayLength}}. Under EU Regulation 261/2004, passengers are entitled to fixed compensation of EUR 250, EUR 400 or EUR 600 (by distance) where the delay at the final destination is 3 hours or more and the cause was within the airline's control. {{detail}}

I request payment of the compensation due under EC261. Please confirm the amount and payment timescale within 14 days. If the claim is rejected on "extraordinary circumstances" grounds, please provide the specific evidence, failing which I will escalate to the relevant national enforcement body or an ADR scheme.`
};
