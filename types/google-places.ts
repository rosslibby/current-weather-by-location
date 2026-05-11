type Match = {
  endOffset: number;
};
type StructuredFormat = {
  mainText: SuggestionText;
  secondaryText: {
    text: string;
  };
};
type PlacePrediction = {
  place: string;
  placeId: string;
  text: SuggestionText;
  structuredFormat: StructuredFormat;
  types: string[];
};
type SuggestionText = {
  text: string;
  matches: Match[];
};
export type Suggestion = {
  placePrediction: PlacePrediction;
};
