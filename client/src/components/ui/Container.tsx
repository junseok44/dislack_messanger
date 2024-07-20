import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    // <Box
    //   mx="auto" // 수평 중앙 정렬
    //   width={{
    //     base: "100%", // 기본: 전체 너비
    //     sm: "100%", // 30em 이상: 600px
    //     md: "728px", // 48em 이상: 728px
    //     lg: "920px", // 62em 이상: 920px
    //     xl: "1400px", // 80em 이상: 1400px
    //     "2xl": "1400px", // 96em 이상: 1400px
    //   }}
    //   px={{ base: 4, md: 8 }} // 반응형 수평 패딩 (기본: 4, 중간 화면 이상: 8)
    // >
    //   {children}
    // </Box>
    <div>{children}</div>
  );
};

export default Container;
