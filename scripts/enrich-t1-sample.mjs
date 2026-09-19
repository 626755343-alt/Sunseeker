import{readFileSync,writeFileSync}from'node:fs';
const file='public/t1-starter.json',data=JSON.parse(readFileSync(file,'utf8'));
const ocrCorrections={
 'judgmental':'judging people and criticizing them',
 'equate...with':'to consider one thing equal to another',
 'bond':'to join two things firmly together',
 'boost':'to make something increase a lot',
 'the increased flow of':'a smooth or steady movement of liquid, gas, or electricity',
 'paradox':'a statement that contradicts itself',
 'Walter Winchell':'an American journalist and broadcaster'
};
const additions={
 'neutral':{definition:'not positive or negative',definitionSource:'ppt',sourceSlide:81},
 'column':{definition:'a regular article in a newspaper or magazine, usually on a particular subject and written by the same person',definitionSource:'online',definitionUrl:'https://dictionary.cambridge.org/us/dictionary/english/column'},
 'tabloid':{definition:'a popular newspaper with small pages, many pictures, and short reports',definitionSource:'online',definitionUrl:'https://dictionary.cambridge.org/us/dictionary/english/tabloid'},
 'prefrontal cortex area':{definition:'the front part of the brain involved in planning, decision-making, and other executive functions',definitionSource:'online',definitionUrl:'https://pmc.ncbi.nlm.nih.gov/articles/PMC8617292/'},
 'assisted living facility':{definition:'a residential place for people who need help with daily care but less care than a nursing home provides',definitionSource:'online',definitionUrl:'https://www.nia.nih.gov/health/assisted-living-and-nursing-homes/long-term-care-facilities-assisted-living-nursing-homes'},
 'totalitarian country':{definition:'a country whose government seeks to control both public and private life',definitionSource:'online',definitionUrl:'https://openstax.org/books/introduction-philosophy/pages/11-2-forms-of-government'},
 'digital media':{definition:'media that can be stored, viewed, or shared using computers and other digital devices',definitionSource:'online',definitionUrl:'https://dictionary.cambridge.org/us/dictionary/english/digital-media'},
 'military housing':{definition:'housing for service members and their families, often on or near a military installation',definitionSource:'online',definitionUrl:'https://www.militaryonesource.mil/resources/millife-guides/housing-living/'},
 'specific site':{definition:'a particular place or location',definitionSource:'online',definitionUrl:'https://dictionary.cambridge.org/us/dictionary/english/site'},
 'Perez Hilton, Gawker, TMZ':{definition:'examples of websites and blogs that publish celebrity gossip',definitionSource:'ppt',sourceSlide:87},
 'People, Star, Us':{definition:'examples of U.S. magazines focused on celebrity news and gossip',definitionSource:'ppt',sourceSlide:88},
 'National Enquirer':{definition:'an American tabloid publication known for celebrity and sensational stories',definitionSource:'online',definitionUrl:'https://apnews.com/article/57f0c462af437fb07967a041b6f66022'}
};
for(const entry of data.entries){if(entry.definition&&ocrCorrections[entry.headword]&&entry.sourceSlide)entry.definition=ocrCorrections[entry.headword];const extra=additions[entry.headword];if(extra&&!entry.definition)Object.assign(entry,extra)}
writeFileSync(file,JSON.stringify(data,null,2));console.log(`${data.entries.filter(e=>e.definition).length}/${data.entries.length} sample definitions`);
