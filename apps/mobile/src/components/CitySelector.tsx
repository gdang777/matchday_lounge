import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type City = 'VANCOUVER' | 'TORONTO';

type Props = {
  value:    City | null;
  onChange: (city: City) => void;
};

export default function CitySelector({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {(['VANCOUVER', 'TORONTO'] as City[]).map((city) => (
        <TouchableOpacity
          key={city}
          style={[styles.option, value === city && styles.optionSelected]}
          onPress={() => onChange(city)}
          activeOpacity={0.8}
        >
          <Text style={[styles.label, value === city && styles.labelSelected]}>
            {city === 'VANCOUVER' ? '🏔 Vancouver' : '🏙 Toronto'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap:           12,
  },
  option: {
    flex:              1,
    paddingVertical:   14,
    paddingHorizontal: 8,
    borderRadius:      10,
    borderWidth:       1.5,
    borderColor:       '#2a2a4a',
    alignItems:        'center',
    backgroundColor:   '#1a1a2e',
  },
  optionSelected: {
    borderColor:     '#e94560',
    backgroundColor: '#e9456015',
  },
  label: {
    fontSize:   14,
    fontWeight: '600',
    color:      '#a0a0b0',
  },
  labelSelected: {
    color: '#e94560',
  },
});
