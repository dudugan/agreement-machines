---
aliases:
reference: Heinz et al. (2011) Tier-based Strictly Local Constraints for Phonology. 2011. Proceedings of the 49th Annual Meeting Of the Association for Computational Linguistics::shortpapers. pp58-64.
---
TL;DR:
1. First defines the [[Tier-based Strictly Local]] (TSL) class of languages. 
2. Review properties of this class. 
3. Hypothesize that [[All phonotactic processes are TSL]]. 

---

# motivation
The TSL class is motivated by tiered phenomena in phonology, which have been studied for a long time and have existing computational formalizations and learning algorithms. However, their formal language properties have not been explored. 

# properties of TSL
- TSL contains the [[Strictly Local]] class of languages
- TSL languages are all [[Star-free]]
- TSL languages are not contained by the [[Locally Threshold-Testable]] or [[Piecewise Testable]] classes. 
- TSL languages are closed under suffix and prefix. 
- TSL languages are string extension classes, meaning they are:
	- closed under intersection
	- efficiently learnable from positive data (with a known tier)

# definition of TSL
An SL-*k* language L can be defined as (Sigma, S, K) where:
- Sigma is a finite alphabet
- S is a set of forbidden factors of length *k*, from Sigma\*
- L contains all strings in Sigma\* which don't contain any factor in S

A TSL-*k* language L can be defined as (Sigma, T, S, *k*) where:
- Sigma is a finite alphabet
- T is a subset of Sigma
- S is a set of forbidden factors of length *k*, from T\*
- L contains all strings in Sigma\* which, when you remove all symbols not in T from the string, don't contain any factor in S

# hypothesis
All humanly possible segmental phonotactic patterns are TSL. 

Three classes of phonotactic constraints:
1. Local segmental patterns (SL)
2. Long-distance segmental patterns (consonant harmony, disharmony, vowel harmony)
3. Stress patterns

Three kinds of vowel harmony patterns:
1. Without neutral vowels
	1. analyze same as assimilatory consonant harmony
2. With opaque vowels (which don't harmonize, but begin their own harmony domain)
	1. analyze by allowing Xi but not iX on the tier, if the opaque vowel is *i*
3. With transparent vowels (which don't harmonize or begin their own domain)
	1. analyze by removing these from the tier
