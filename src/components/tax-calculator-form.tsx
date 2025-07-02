'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { calculateMonthlyTax } from '@/lib/tax-calculator';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// 表单验证模式
const formSchema = z.object({
  totalIncome: z.coerce.number().min(0, {
    message: '累计收入不能为负数',
  }),
  totalTaxPaid: z.coerce.number().min(0, {
    message: '累计已缴税款不能为负数',
  }),
  currentMonth: z.coerce.number().min(1, {
    message: '月份必须大于等于1',
  }).max(12, {
    message: '月份必须小于等于12',
  }),
  currentMonthIncome: z.coerce.number().min(0, {
    message: '下月收入不能为负数',
  }),
  threshold: z.coerce.number().min(0, {
    message: '起征点不能为负数',
  }),
  insurance: z.coerce.number().min(0, {
    message: '社保公积金不能为负数',
  }),
  specialDeduction: z.coerce.number().min(0, {
    message: '专项附加扣除不能为负数',
  }),
});

type FormData = z.infer<typeof formSchema>;

type CalculationResult = {
  currentMonthTax: number;
  newTotalIncome: number;
  totalTaxDue: number;
  taxRate: {
    threshold: number;
    rate: number;
    quickDeduction: number;
    level: number;
  };
} | null;

export function TaxCalculatorForm() {
  const [result, setResult] = useState<CalculationResult>(null);

  // 初始化表单
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalIncome: 0,
      totalTaxPaid: 0,
      currentMonth: new Date().getMonth() + 1, // 默认为当前月份
      currentMonthIncome: 0,
      threshold: 5000,
      insurance: 0,
      specialDeduction: 0,
    },
  });

  // 提交表单
  function onSubmit(values: FormData) {
    const calculationResult = calculateMonthlyTax(values);
    setResult(calculationResult);
  }

  // 格式化金额
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // 格式化百分比
  const formatPercent = (rate: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'percent',
      minimumFractionDigits: 0,
    }).format(rate);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>个人所得税计算器</CardTitle>
          <CardDescription>
            输入您的收入信息，计算下月可能需缴纳的个人所得税
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>累计工资收入 (元)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>截至上月的累计工资收入</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalTaxPaid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>累计已缴纳个税 (元)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>截至上月的累计已缴纳个税</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currentMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>当前月份</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="12" placeholder="当前月份" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentMonthIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>下月收入 (元)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>起征点 (元/月)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="insurance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>社保公积金 (元/月)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialDeduction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>专项附加扣除 (元/月)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">计算个税</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>计算结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">下月应缴纳个税</div>
                  <div className="text-2xl font-bold">{formatCurrency(result.currentMonthTax)}</div>
                  <div className="text-xs text-muted-foreground mt-1">第{Number(form.getValues().currentMonth) + 1}月预计缴纳</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">当前税率</div>
                  <div className="text-2xl font-bold">{formatPercent(result.taxRate.rate)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">累计工资收入</div>
                  <div className="text-xl font-semibold">{formatCurrency(result.newTotalIncome)}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">累计应缴个税</div>
                  <div className="text-xl font-semibold">{formatCurrency(result.totalTaxDue)}</div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">适用税率区间</div>
                <div className="text-lg font-semibold">
                  第{result.taxRate.level}级: {formatPercent(result.taxRate.rate)}
                  {result.taxRate.level < 7 && (
                    <span className="text-sm text-muted-foreground ml-2">
                      (超过{formatCurrency(result.taxRate.threshold)}/年)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}