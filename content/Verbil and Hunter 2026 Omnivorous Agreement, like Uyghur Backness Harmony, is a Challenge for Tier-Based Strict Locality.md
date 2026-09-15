---
reference:
---
TL;DR:

**Background:** [[Mayer and Major 2018]] found that Uyghur backness harmony was not [[Tier-based Strictly Local]], but instead [[Output-TSL]]. 

**Claim:** Omnivorous Agreement in Mundari shows a similar pattern, and is also not TSL, but instead OTSL. 

**Thrust:** Harmony/agreement patterns must be OTSL and not TSL if you have a hierarchy of more than two levels. 

---

# Uyghur backness harmony
1. If there's a harmonizing vowel in the stem, the suffix should match the last one. 
2. Elif there's a harmonizing consonant in the stem, the suffix should match the last one. 
3. Else, the suffix should be a default value. 

This requires the rule, going left-to-right:
- Project a harmonizing consonant only if you haven't projected a harmonizing vowel yet. 

# Mundari omnivorous agreement
1. If there's a first person DP as direct or indirect object, the suffix should be *-iɲ*. 
2. Elif there's a second person DP as direct or indirect object, the suffix should be *-m*. 
3. Else, the suffix should be *-i*. 

This requires the rule, going bottom-to-top:
- Project a second person DP only if you haven't projected a first person DP yet. 

# Definition of O-TSL
>A (*j*, *k*)-OTSL grammar is like a *k*-TSL grammar, except that the tier projection function can take into account the most recent *j-1* symbols already projected to the tier when deciding whether to project a particular surface symbol. 

So, 

A (*j*, *k*)-OTSL language L can be defined as (Sigma, T, S, *k*) where:
- Sigma is a finite alphabet
- T is a set of tuples (sigma, tau), where sigma is in Sigma, and tau is in Union(start-symbol, Sigma) and is of length *j-1*. 
- S is a set of forbidden factors of length *k*, from Sigma\*
- Progressing from the bottom of the c-string upwards, project symbol sigma onto the tier iff there is a member of T (sigma, tau) and the tier constructed thus far ends in tau. 
- L contains all strings in Sigma\* whose tiers don't contain any factor in S

# Other languages with three-level agreement hierarchies
- Hayu
- Onondaga
- Mundari (also has a Sg > Pl > Du hierarchy)

# Theoretical Thrust
Kind of backs up [[Graf 2022 Typological Implications of Tier-Based Strictly Local Movement|Graf (2022)]]'s [[Cognitive Parallelism Hypothesis]]:
- Distinct language models (e.g. phonology, syntax) have the same formal complexity. 

# Thoughts about this as an MTSM
This actually fits very well as an MTSM. Progressing bottom-up, the MTSM simply needs to read the current stored value for a given tier, and then decide whether to replace it with the current head value or not, depending on some listed hierarchy of features. 

