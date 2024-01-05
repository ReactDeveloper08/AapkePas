<Text
  style={[
    styles.dateTxt,
    {fontSize: wp(2.2)},
    isCurrentUser && {
      color: color.BLACK,
      textAlign: 'right',
      fontSize: wp(2.2),
      marginTop: wp(1),
    },
  ]}>
  {strTime}
</Text>;
