import optimize from "../utils/optimize.js";



test('optimize: Output of optimize matches Output of R version', () => {
    const f = (x, {a}) => Math.pow((x - a), 2)
    const xmin = optimize(f, [0, 1], {
        maximum: false,
        tol: 0.0001
    },
        {
            a: 1/3
    })
    expect(xmin).toStrictEqual(
        { extremum: 0.3333223155064413, objective: 1.2139250942210856e-10 }
    )
})