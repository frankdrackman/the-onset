// Fully written detail content for the two pages wireframe v2 specifies as detail
// screens: 2f (the article) and 2c (the episode, whose content lives in episodes.mjs).
// Every other item renders the same template with its standfirst as the answer-first
// block and the wireframe's own "full article body continues" placeholder for the
// body — the template is proven, the copy is a production task.

export const LONGFORM = {
  'heart-attack-cardiac-arrest-heart-failure': {
    inShort: [
      'They are three different problems. A heart attack is a blocked artery starving heart muscle of blood. A cardiac arrest is the heart stopping outright, usually from an electrical fault. Heart failure is a heart that keeps beating but no longer pumps well enough, and it develops over months or years rather than minutes.',
      'The one that needs an ambulance in the next sixty seconds is cardiac arrest: the person is unresponsive and not breathing normally. A heart attack also needs an ambulance, but the person is usually awake. Heart failure needs an appointment, not an ambulance — unless breathing suddenly worsens.',
    ],
    body: [
      {
        h2: 'The three are not the same thing',
        paras: [
          'The words get used interchangeably in conversation and in headlines, which is a problem, because the right response to each is different.',
          'A <strong>heart attack</strong> is a plumbing problem. A coronary artery narrows or blocks, and the muscle downstream begins to die for want of blood. The person is typically conscious and can tell you something is wrong. Chest discomfort is the classic sign, but so are pain radiating to the jaw, neck, back or arm, sudden breathlessness, cold sweat, nausea and a sense of dread that patients describe far more consistently than any textbook does.',
          'A <strong>cardiac arrest</strong> is an electrical problem. The heart’s rhythm collapses and it stops pumping. The person drops, is unresponsive, and is not breathing normally — occasional gasping does not count as breathing. Without compressions, survival falls by roughly ten per cent for every minute that passes.',
          'A <strong>heart failure</strong> is a mechanical problem that develops slowly. The heart still beats, but not strongly or efficiently enough to meet the body’s demand. Fluid backs up. People notice breathlessness on stairs they used to manage, swelling in the ankles, waking at night short of breath, or needing more pillows than they used to.',
        ],
      },
      {
        h2: 'What to do in the first ten minutes',
        paras: [
          'For a suspected <strong>cardiac arrest</strong>: call emergency services, start chest compressions immediately, and send someone for the nearest defibrillator. Hands-only compressions are enough — push hard and fast in the centre of the chest. Doing something imperfectly is far better than waiting for someone qualified.',
          'For a suspected <strong>heart attack</strong>: call an ambulance rather than driving. Paramedics can begin treatment and can restart a heart that stops en route; a car cannot. Sit the person down, keep them calm, and follow the dispatcher’s guidance on aspirin.',
          'For worsening <strong>heart failure</strong>: same-day contact with a clinician. Sudden weight gain of two to three pounds in a day or five in a week, new swelling, or breathlessness lying flat all mean the fluid balance has shifted and the plan needs adjusting now rather than at the next scheduled visit.',
        ],
      },
      {
        h2: 'Why the confusion matters',
        paras: [
          'People delay because they are waiting for the symptom to match the film. Crushing central chest pain is one presentation of a heart attack and not the only one, and the atypical presentations are more common in women, in people with diabetes and in older adults.',
          'The rule clinicians would like the public to use is simpler than any symptom list: if something in your chest or breathing is new, severe or unexplained, treat it as urgent and let the emergency department rule it out. Being sent home reassured is the good outcome, not the wasted trip.',
        ],
      },
    ],
    faqs: [
      { q: 'What is the difference between a heart attack and cardiac arrest?',
        a: 'A heart attack is a blocked artery cutting off blood supply to part of the heart muscle; the person is usually conscious. A cardiac arrest is the heart stopping altogether from an electrical fault; the person is unresponsive and not breathing normally. A heart attack can cause a cardiac arrest, which is why a heart attack is treated as an emergency even when the person seems stable.' },
      { q: 'Can you survive cardiac arrest at home?',
        a: 'Yes, and the single biggest factor is whether someone starts chest compressions before the ambulance arrives. Immediate bystander CPR can double or triple the chance of survival. Hands-only compressions, without rescue breaths, are recommended for untrained bystanders.' },
      { q: 'Is heart failure the same as the heart stopping?',
        a: 'No. Heart failure means the heart is not pumping as well as it should, not that it has stopped. Many people live with heart failure for years with medication, monitoring and adjustments to daily habits. The name is unhelpful, and it frightens people more than the diagnosis warrants.' },
    ],
  },
};
